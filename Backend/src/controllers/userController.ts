import { Request, Response } from "express";
import { read, write } from "../utils/fileHandler";
import { v4 as uuidv4 } from 'uuid'
import { User } from "../models/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const saltRounds = 10

class UserController {

    static fetchUsers(req: Request, res: Response): void {
        const users = read()
        res.json(users)
    }

    static registerUser(req: Request, res: Response) {
        const { name, email, username, password } = req.body

        if (!username || !password || !email || !name) {
            return res.json({ message: "All fields are required" });
        }

        const users: User[] = read()

        const userExist: boolean = users.some((user: User) => user.username == username)
        if (userExist) {
            return res.json({ message: "User already exists" })
        }

        const hashpass = bcrypt.hashSync(password, saltRounds)

        const newUser: User = {
            id: uuidv4(),
            username,
            password: hashpass,
            name,
            email
        }

        users.push(newUser)
        write(users)

        const secret: string | undefined = process.env.SECRET_KEY
        if (!secret) {
            return res.json({ message: "Secret is undefined" })
        }

        try {
            const accesstoken = jwt.sign(
                {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    name: newUser.name
                },
                secret,
                { expiresIn: '1h' }
            )


            const refreshtoken = jwt.sign(
                {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    name: newUser.name
                },
                secret,
                { expiresIn: '7h' }
            )
            res.json({ message: "User Registered", accesstoken, refreshtoken })
        } catch {
            res.json({ message: "Error generating token" })
        }
    }


    static loginUser(req: Request, res: Response) {
        const { username, password } = req.body

        if (!username || !password) {
            res.json({ message: "Username and Password are required" })
        }

        const users: User[] = read()

        const user = users.find(u => u.username === username);

        if (user) {


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
                            name: user.name
                        },
                        secret,
                        { expiresIn: '1h' }
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

                catch {
                    res.json({ message: "error" });

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
            const decoded:any = jwt.verify(refreshtoken, secret);

            const accesstoken = jwt.sign(
                {
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email,
                    name: decoded.name
                },
                secret,
                { expiresIn: '1h' }
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
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }
    }





}


export default UserController









