import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Device } from "../entities/Device";

export async function loginUser(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required" });
    }

    try {
        const userRepo = AppDataSource.getRepository(User);
        const deviceRepo = AppDataSource.getRepository(Device);

        const user = await userRepo.findOne({ where: { username } });
        if (!user) return res.json({ message: "User not found" });

        const bcrypt = require("bcryptjs");
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return res.json({ message: "Wrong Password" });

        // 🧠 Check for trusted device cookie
        const cookieToken = req.cookies.trusted_device_token;
        if (cookieToken && user.isTwofaEnabled) {
            const tokenHash = crypto.createHash("sha256").update(cookieToken).digest("hex");
            const device = await deviceRepo.findOne({
                where: { user: { id: user.id }, tokenHash },
            });

            if (device && device.expires_at > new Date()) {
                return issueTokens(res, user, "Logged in via trusted device");
            }
        }

        // 🔐 If 2FA enabled but no trusted cookie
        if (user.isTwofaEnabled) {
            return res.json({ message: "2FA required", twofaRequired: true, userId: user.id });
        }

        // 🟢 Normal login (no 2FA)
        return issueTokens(res, user, "Logged in successfully");

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database error" });
    }
}
import crypto from "crypto";
import * as twofactor from "node-2fa";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Device } from "../entities/Device";
import { Request, Response } from "express";

export async function twofacverify(req: Request, res: Response) {
    try {
        const { userId, code, secret, login, trustDevice } = req.body;
        if (!userId || !code)
            return res.status(400).json({ error: "userId and code are required" });

        const userRepo = AppDataSource.getRepository(User);
        const deviceRepo = AppDataSource.getRepository(Device);

        const user = await userRepo.findOneBy({ id: userId });
        if (!user) return res.status(404).json({ error: "User not found" });

        const usedSecret =
            secret ||
            user.twofaSecret ||
            twofactor.generateSecret({ name: "SocialSphere", account: user.email }).secret;

        const verification = twofactor.verifyToken(usedSecret, code, 0);
        if (!verification || verification.delta !== 0)
            return res.status(400).json({ success: false, message: "Invalid or expired token" });

        // 🔄 Enable or disable 2FA
        if (!login) {
            user.twofaSecret = usedSecret;
            user.isTwofaEnabled = !user.isTwofaEnabled;
            await userRepo.save(user);

            return res.json({
                success: true,
                message: user.isTwofaEnabled
                    ? "Two-factor authentication enabled"
                    : "Two-factor authentication disabled",
            });
        }

        // ✅ If this is a login verification
        if (login) {
            const accesstoken = jwt.sign(
                { id: user.id, username: user.username, email: user.email, role: user.role },
                process.env.SECRET_KEY!,
                { expiresIn: "15m" }
            );
            const refreshtoken = jwt.sign(
                { id: user.id, username: user.username },
                process.env.SECRET_KEY!,
                { expiresIn: "7d" }
            );

            // 🧠 If user selected "Trust this device"
            if (trustDevice) {
                const rawToken = crypto.randomBytes(64).toString("hex");
                const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
                const fingerprint = `${req.ip}-${req.headers["user-agent"]}`;
                const deviceFingerprint = crypto.createHash("sha256").update(fingerprint).digest("hex");
                const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

                const newDevice = deviceRepo.create({
                    user,
                    deviceFingerprint,
                    deviceName: req.headers["user-agent"] || "Unknown Device",
                    tokenHash,
                    expires_at: expiresAt,
                });
                await deviceRepo.save(newDevice);

                // Set cookie securely
                res.cookie("trusted_device_token", rawToken, {
                    httpOnly: true,
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
