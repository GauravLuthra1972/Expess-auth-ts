import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { generateSecret, verifyToken } from "2fa-node";
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
            const user = await userRepo.findOne({ where: { username } });

            if (!user) return res.json({ message: "User is not registered" });

            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) return res.json({ message: "Wrong Password" });

            const secret = process.env.SECRET_KEY!;
            const accesstoken = jwt.sign(
                { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role },
                secret,
                { expiresIn: '10s' }
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

            const newSecret = await generateSecret({
                name: "SocialSphere",
                account: user.username,
                numberOfSecretBytes: 20,
                counter: 0
            });

            // user.twofaSecret = newSecret.secret;
            const qrCodeImage = await QRCode.toDataURL(newSecret.uri);

            // await userRepo.save(user);

            res.json({ qrCodeImage, secret: newSecret.secret });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async twofacverify(req: Request, res: Response) {
    try {
        const { userId, code, secret } = req.body;
        if (!userId || !code || !secret) 
            return res.status(400).json({ error: "userId, code, and secret are required" });

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id: userId });
        if (!user) return res.status(404).json({ error: "User not found" });

       const verification = verifyToken(secret, code) ;
        if (!verification) 
            return res.status(400).json({ success: false, message: "Invalid token" });

        user.twofaSecret = secret;
        user.isTwofaEnabled = true;
        await userRepo.save(user);

        res.json({
            success: true,
            message: `2FA enabled successfully`
        });
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









