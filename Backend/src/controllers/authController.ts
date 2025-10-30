import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from "../config/db";

const saltRounds = 10

class authController {


    static async registerUser(req: Request, res: Response) {
        const { name, email, username, password } = req.body;

        if (!username || !password || !email || !name) {
            return res.json({ message: "All fields are required" });
        }

        try {
            const [existing]: any = await db.query(
                'SELECT * FROM users2 WHERE username = ?',
                [username]
            );

            if (existing.length > 0) {
                return res.json({ message: "User already Exists" });
            }

            const hashpass = bcrypt.hashSync(password, saltRounds);

            const [result]: any = await db.query(
                'INSERT INTO users2 (name, email, username, password) VALUES (?, ?, ?, ?)',
                [name, email, username, hashpass]
            );

            const newUserId = result.insertId;

            const secret: string | undefined = process.env.SECRET_KEY;
            if (!secret) return res.json({ message: "Secret is undefined" });

            const accesstoken = jwt.sign(
                { id: newUserId, username, email, name },
                secret,
                { expiresIn: '1h' }
            );

            const refreshtoken = jwt.sign(
                { id: newUserId, username, email, name },
                secret,
                { expiresIn: '7h' }
            );

            res.json({ message: "User Registered", accesstoken, refreshtoken });
        } catch (error: any) {
            console.error(error);
            res.json({ message: "Database error" });
        }
    }



    static async loginUser(req: Request, res: Response) {
        const { username, password } = req.body

        if (!username || !password) {
            return res.json({ message: "Username and Password are required" })
        }

        const [existing]: any = await db.query('Select * from users2 where username=?', [username])

        if (existing.length > 0) {
            const user = existing[0]


            const flag = bcrypt.compareSync(password, user.password)

            if (flag) {
                const secret: string | undefined = process.env.SECRET_KEY
                console.log("secret" + secret)

                if (!secret) {
                    return res.json({ message: "Secret is undefimed" })
                }

                try {
                    const accesstoken = jwt.sign(
                        {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            name: user.name,
                            role:user.role
                        },
                        secret,
                        { expiresIn: '10s' }
                    )

                    const refreshtoken = jwt.sign(
                        {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            name: user.name
                        },
                        secret,
                        { expiresIn: '7h' }
                    )

                    res.json({ message: "Logged in Successfully", accesstoken, refreshtoken });

                }

                catch (err) {
                    res.json({ message: "error", err });

                }


            }
            else {
                res.json({ message: "Wrong Password" });
            }

        } else {
            res.json({ message: "User is not registered" });
        }
    }


    

   


    static refreshToken(req: Request, res: Response) {
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









