import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import db from "../config/db";



const saltRounds = 10

class UserController {

    static async fetchUsers(req: Request, res: Response) {
        try {
            const [rows]: any = await db.query('SELECT * FROM users2');
            res.json(rows);
        }
        catch (err) {
            console.error(err);
            res.json({ message: "Internal Server Error" });
        }
    }


    static userinfo(req: Request, res: Response) {
        const authheader = req.headers.authorization;
        if (!authheader) {
            return res.json({ message: "Authorization header missing" });
        }
        const token = authheader.split(" ")[1];
        if (!token) {
            return res.json({ message: "Bearer token missing" });
        }

        const secret: string | undefined = process.env.SECRET_KEY

        if (!secret) {
            return res.json({ message: "Secret key is undefined" });
        }

        try {
            const info: any = jwt.verify(token, secret)

            return res.json({ message: "User Data Fetched", info })
        }
        catch (err) {
            res.json({ message: "Error in fetching", err })
        }

    }


    static async deleteUser(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.json({ message: "Authorization header missing" });

        const token = authHeader.split(" ")[1];
        if (!token) return res.json({ message: "Bearer token missing" });

        const secret: string | undefined = process.env.SECRET_KEY;
        if (!secret) return res.json({ message: "Secret key is undefined" });

        try {
            const decoded: any = jwt.verify(token, secret);
            const userId = decoded.id;

            const [result]: any = await db.query("DELETE FROM users2 WHERE id = ?", [userId]);
            if (result.affectedRows === 0) return res.json({ message: "User not found" });

            return res.json({ message: "User deleted successfully", id: userId });
        } catch (error) {
            return res.json({ message: "Error deleting user", error });
        }
    }


  static async updateUser(req: Request, res: Response) {
    const { name, username, email } = req.body;

    try {
        const [result]: any = await db.query(
            "UPDATE users2 SET name = ?, username = ? , email = ?",
            [name, username, email]
        );

        res.json({ message: "User updated successfully", updatedUser: { name, username, email } });
    } catch (error) {
        res.json({ message: "Error updating user", error });
    }
}






}


export default UserController









