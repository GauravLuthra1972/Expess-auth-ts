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


    static async userinfo(req: Request, res: Response) {
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
            const decoded: any = jwt.verify(token, secret)
            const userid = decoded.id

            const [info]: any = await db.query('Select * from users2 where id=?', [userid])

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

    static async deletebyId(req: Request, res: Response){
        const {id}=req.params

        try{
            await db.query("Delete from users2 where id=?",[id])
            return res.json({message:"User Deleted"})

        }
        catch(err){
            res.json({"message":"Error Deleted",err})
        }

        
    }


    static async updateUser(req: Request, res: Response) {
        const { id, name, username, email } = req.body;

        try {
            const [user]: any = await db.query("SELECT * FROM users2 WHERE id = ?", [id]);

            if (user.length === 0) {
                return res.json({ message: "User not found" });
            }

            await db.query(
                "UPDATE users2 SET name = ?, username = ?, email = ? WHERE id = ?",
                [name, username, email, id]
            );

            res.json({ message: "User updated successfully", updatedUser: { id, name, username, email } });
        } catch (error) {
            res.json({ message: "Error updating user", error });
        }
    }

    static async profileUpload(req: Request, res: Response) {
        try {
            console.log(req.file);

            if (!req.file) {
                return res.json({ message: "No file uploaded" });
            }

            const cloudinaryUrl = req.file.path;
            console.log(cloudinaryUrl);

            const { id } = req.body
            await db.query(
                'UPDATE users2 SET profile_pic = ? WHERE id = ?',
                [cloudinaryUrl, id]
            );


            return res.json({ message: "File uploaded successfully", file: req.file.path });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error uploading file", err });
        }
    }







}


export default UserController









