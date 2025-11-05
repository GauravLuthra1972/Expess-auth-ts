import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import db from "../config/db";

const saltRounds = 10

class UserController {



    static buildwhere(filter: any[]): string {
        let where = "";


        if (typeof filter[0] === 'string') {
            const [field, , value] = filter;
            where = `WHERE ${field} LIKE '%${value}%'`;
        } else {
            const str: string[] = [];
            for (const item of filter) {
                if (Array.isArray(item)) {
                    const [field, , value] = item;
                    str.push(`${field} LIKE '%${value}%'`);
                } else {
                    str.push(item.toUpperCase());
                }
            }
            if (str.length > 0) {
                where = "WHERE " + str.join(" ");
            }
        }

        return where


    }

     static buildorder(sort: any[]): string {
        let order = "";

        const { selector, desc } = sort[0];
        order = `ORDER BY ${selector} ${desc ? "DESC" : "ASC"}`;


        return order

    }



     async fetchUsers(req: Request, res: Response) {
        try {
            const skip = req.query.skip ? parseInt(req.query.skip as string, 10):null;
            const take = req.query.take ? parseInt(req.query.take as string, 10):null;
            const sort = req.query.sort ? JSON.parse(req.query.sort as string) : null;
            const filter = req.query.filter ? JSON.parse(req.query.filter as string) : null;
            const requireTotalCount = req.query.requireTotalCount
            console.log("require", requireTotalCount)

            console.log(skip)
            console.log(take)

            if (skip!=null && take!=null) {
                let where = "";
                if (filter && filter.length > 0) {
                    where = UserController.buildwhere(filter)

                }


                let order = "";
                if (sort && sort.length > 0) {
                    order = UserController.buildorder(sort)

                }



                const query = `SELECT * FROM users2 ${where} ${order} LIMIT ${take} OFFSET ${skip}`;
                console.log("query4444444",query)
                const [rows]: any = await db.query(query);

                const result: any = { data: rows };

                if (requireTotalCount) {
                    const countQuery = `SELECT COUNT(*) AS total FROM users2 ${where}`;
                    const [countResult]: any = await db.query(countQuery);
                    result.totalCount = countResult[0].total;
                }

                res.json(result);

            }

            else{
                const [rows]: any = await db.query("Select * from users2");
                res.json({message:"ALl users",rows});



            }



        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error", err });
        }
    }



     async userinfo(req: Request, res: Response) {
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


     async deleteUser(req: Request, res: Response) {
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

     async deletebyId(req: Request, res: Response) {
        const { id } = req.params

        try {
            await db.query("Delete from users2 where id=?", [id])
            return res.json({ message: "User Deleted" })

        }
        catch (err) {
            res.json({ "message": "Error Deleted", err })
        }


    }

     async deleteMultiple(req: Request, res: Response) {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "No user IDs provided" });
        }
        try {
            const placeholders = ids.map(() => "?").join(", ");
            await db.query(`DELETE FROM users2 WHERE id IN (${placeholders})`, ids);
            return res.json({ message: `${ids.length} Users Deleted` });
        } catch (err) {
            return res.status(500).json({ message: "Error Deleting Users", err });
        }
    }



     async updateUser(req: Request, res: Response) {
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


     async adminUpdateUser(req: Request, res: Response) {
        const { id, name, username, email, role } = req.body;

        try {

            const [userResult]: any = await db.query("SELECT * FROM users2 WHERE id = ?", [id]);
            if (!userResult || userResult.length === 0) {
                return res.json({ message: "User not found" });
            }

            const existingUser = userResult[0];


            const updatedUser = {
                name: name ?? existingUser.name,
                username: username ?? existingUser.username,
                email: email ?? existingUser.email,
                role: role ?? existingUser.role
            };
            await db.query(
                "UPDATE users2 SET name = ?, username = ?, email = ?, role = ? WHERE id = ?",
                [updatedUser.name, updatedUser.username, updatedUser.email, updatedUser.role, id]
            );

            res.json({ message: "User updated successfully" });
        } catch (error) {
            res.json({ message: "Error updating user", error });
        }
    }



     async profileUpload(req: Request, res: Response) {
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



    async adminadduser(req: Request, res: Response) {

        


    }







}


export default UserController









