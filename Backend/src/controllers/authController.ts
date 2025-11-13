import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Device } from "../entities/Device";
import * as twofactor from "node-2fa";
import crypto from "crypto";



import QRCode from "qrcode";

const saltRounds = 10

class authController {


    async registerUser(req: Request, res: Response) {

        console.log("register running")
        const { name, email, username, password, role } = req.body;

        if (!username || !password || !email || !name) {
            return res.json({ message: "All fields are required" });
        }

        try {
            const userRepo = AppDataSource.getRepository(User);


            const existingUser = await userRepo.findOne({ where: { username } });

            if (existingUser) {
                return res.json({ message: "User already Exists" });
            }

            const hashedPassword = bcrypt.hashSync(password, saltRounds);

            const newUser = userRepo.create({
                name,
                email,
                username,
                password: hashedPassword,
                role: role || "user",
            });

            const savedUser = await userRepo.save(newUser);
            console.log(savedUser)

            const secret: string | undefined = process.env.SECRET_KEY;
            if (!secret) return res.json({ message: "Secret is undefined" });

            const accesstoken = jwt.sign(
                { id: savedUser.id, username, email, name },
                secret,
                { expiresIn: '10s' }
            );

            const refreshtoken = jwt.sign(
                { id: savedUser.id, username, email, name },
                secret,
                { expiresIn: '7h' }
            );

            return res.json({ message: "User Registered", accesstoken, refreshtoken });
        } catch (error: any) {
            console.error(error);
            return res.json({ message: "Database error" });
        }
    }




    async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ message: "Username and Password are required" });
        }

        try {
            const userRepo = AppDataSource.getRepository(User);
            console.log("phase1")
            const deviceRepo = AppDataSource.getRepository(Device);

            const user = await userRepo.findOne({ where: { username } });

            if (!user) return res.json({ message: "User is not registered" });

            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) return res.json({ message: "Wrong Password" });
            console.log(req.cookies)




            const cookieName = `trusted_device_token_${user.id}`;
            const cookieToken = req.cookies[cookieName];

            console.log("cookiesall", req.cookies)

            console.log("cooki", cookieToken)

            if (cookieToken && user.isTwofaEnabled) {
                const tokenHash = crypto.createHash("sha256").update(cookieToken).digest("hex");

                const fingerprint = `${req.ip}-${req.headers["user-agent"]}`;
                const deviceFingerprint = crypto.createHash("sha256").update(fingerprint).digest("hex");

                const device = await deviceRepo.findOne({
                    where: { user: { id: user.id }, tokenHash, deviceFingerprint },
                });

                if (device && device.expires_at > new Date()) {
                    const secret = process.env.SECRET_KEY!;
                    const accesstoken = jwt.sign(
                        { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role },
                        secret,
                        { expiresIn: '1d' }
                    );

                    const refreshtoken = jwt.sign(
                        { id: user.id, username: user.username, email: user.email, name: user.name },
                        secret,
                        { expiresIn: '7h' }
                    );

                    return res.json({ message: "Logged in Successfully", accesstoken, refreshtoken });

                }
            }







            if (user.isTwofaEnabled) return res.json({ message: "2FA enabled", twofaRequired: true, userId: user.id });

            const secret = process.env.SECRET_KEY!;
            const accesstoken = jwt.sign(
                { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role },
                secret,
                { expiresIn: '1h' }
            );

            const refreshtoken = jwt.sign(
                { id: user.id, username: user.username, email: user.email, name: user.name },
                secret,
                { expiresIn: '7h' }
            );

            res.json({ message: "Logged in Successfully", accesstoken, refreshtoken });

        } catch (error) {
            console.error(error);
            res.json({ message: "Database error" });
        }
    }


    async twoFac(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            if (!userId) return res.status(400).json({ error: "userId is required" });

            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOneBy({ id: userId });
            if (!user) return res.status(404).json({ error: "User not found" });

            const newSecret = twofactor.generateSecret({
                name: "SocialSphere",
                account: user.username,
            });

            const qrCodeImage = await QRCode.toDataURL(newSecret.uri);

            res.json({ qrCodeImage, secret: newSecret.secret });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async twofacverify(req: Request, res: Response) {
        try {
            const { userId, code, secret, login, trust } = req.body;
            if (!userId || !code)
                return res.status(400).json({ error: "userId and code are required" });

            const userRepo = AppDataSource.getRepository(User);
            const deviceRepo = AppDataSource.getRepository(Device);

            const user = await userRepo.findOneBy({ id: userId });
            if (!user) return res.status(404).json({ error: "User not found" });

            const usedSecret = secret || user.twofaSecret || twofactor.generateSecret({ name: 'SocialSphere', account: user.email }).secret;

            const verification = twofactor.verifyToken(usedSecret, code, 0);
            if (!verification || verification.delta !== 0) {
                return res.status(400).json({ success: false, message: "Invalid or expired token" });
            }

            if (!login) {
                user.twofaSecret = usedSecret;
                user.isTwofaEnabled = !user.isTwofaEnabled;
                await userRepo.save(user);

                return res.json({
                    success: true,
                    message: user.isTwofaEnabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled"
                });

            }



            if (login) {
                const secretKey = process.env.SECRET_KEY!;
                const accesstoken = jwt.sign(
                    { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role },
                    secretKey,
                    { expiresIn: '1h' }
                );

                const refreshtoken = jwt.sign(
                    { id: user.id, username: user.username, email: user.email, name: user.name },
                    secretKey,
                    { expiresIn: '7h' }
                );

                if (trust) {

                    const rawToken = crypto.randomBytes(64).toString("hex");
                    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
                    const fingerprint = `${req.ip}-${req.headers["user-agent"]}`;
                    const deviceFingerprint = crypto.createHash("sha256").update(fingerprint).digest("hex");
                    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

                    const newDevice = deviceRepo.create({
                        user,
                        deviceFingerprint,
                        deviceName: req.headers["user-agent"] || "Unknown Device",
                        tokenHash,
                        expires_at: expiresAt,
                    });

                    await deviceRepo.save(newDevice);

                    const cookieName = `trusted_device_token_${user.id}`;


                    res.cookie(cookieName, rawToken, {

                        secure: true,
                        sameSite: "strict",
                        expires: expiresAt,
                    });

                }

                return res.json({
                    success: true,
                    message: "2FA verified successfully",
                    accesstoken,
                    refreshtoken,
                });
            }



        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }



    refreshToken(req: Request, res: Response) {
        const { refreshtoken } = req.body;
        if (!refreshtoken) {
            return res.json({ message: "Refresh token missing" });
        }

        const secret: string | undefined = process.env.SECRET_KEY;
        if (!secret) {
            return res.json({ message: "Secret key undefined" });
        }

        try {
            const decoded: any = jwt.verify(refreshtoken, secret);

            const accesstoken = jwt.sign(
                {
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email,
                    name: decoded.name
                },
                secret,
                { expiresIn: '10s' }
            );

            const newRefreshToken = jwt.sign(
                {
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email,
                    name: decoded.name
                },
                secret,
                { expiresIn: '7d' }
            );

            return res.json({
                message: "Token refreshed successfully",
                accesstoken,
                refreshtoken: newRefreshToken
            });
        } catch {
            return res.json({ message: "Invalid or expired refresh token" });
        }
    }
}


export default authController