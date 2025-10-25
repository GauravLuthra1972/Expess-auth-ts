import { Request, Response } from "express";
import { read, write } from "../utils/fileHandler";
import { v4 as uuidv4 } from 'uuid'
import { User } from "../models/User";
import bcrypt from 'bcrypt'


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

        res.json({ message: "User Registered " })
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
                res.json({ message: "Logged in Successfully", user });

            }
            else {
                res.json({ message: "Wrong Password" });
            }

        } else {
            res.json({ message: "User is not registered" });
        }
    }




}


export default UserController









