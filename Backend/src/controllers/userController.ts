import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import db from "../config/db";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
const saltRounds = 10

class UserController {



    static buildwhere(filter: any[]): string {
        let where = "";


        if (typeof filter[0] === 'string') {
            const [field, , value] = filter;
            where = `${field} LIKE '%${value}%'`;
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
                where = str.join(" ");
            }
        }

        return where


    }

    static buildorder(sort: any[]) {
        const order: any = {};

        sort.forEach(({ selector, desc }) => {
            order[`user.${selector}`] = desc ? "DESC" : "ASC";
        });

        return order;
    }




    // async fetchUsers(req: Request, res: Response) {
    //     try {
    //         const skip = parseInt(req.query.skip as string)
    //         const take = parseInt(req.query.take as string)
    //         const requireTotalCount = req.query.requireTotalCount

    //         const userRepo = AppDataSource.getRepository(User)
    //         let query = userRepo.createQueryBuilder("user")


    //         query.skip(skip).take(take)
    //         // if (req.query.sort) {
    //         //     const sort = JSON.parse(req.query.sort as string)
    //         //     console.log(sort)

    //         // }
    //         // if (req.query.filter) {
    //         //     const filter = JSON.parse(req.query.filter as string)
    //         //     console.log(filter)

    //         // }




    //         // const requireTotalCount = req.query.requireTotalCount
    //         // console.log("require", requireTotalCount)

    //         // console.log(skip)
    //         // console.log(take)

    //         // if (skip != null && take != null) {
    //         //     let where = "";

    //         //     if (req.query.filter) {
    //         //         const filter = JSON.parse(req.query.filter as string)
    //         //         console.log(filter)

    //         //         if (filter && filter.length > 0) {
    //         //             where = UserController.buildwhere(filter)

    //         //         }

    //         //     }
    //         //     let order = ""


    //         //     if (req.query.sort) {
    //         //         const sort = JSON.parse(req.query.sort as string)
    //         //         console.log(sort)

    //         //         if (sort && sort.length > 0) {
    //         //             order = UserController.buildorder(sort)

    //         //         }

    //         //     }









    //         //     const query = `SELECT * FROM Users ${where} ${order} LIMIT ${take} OFFSET ${skip}`;
    //         //     console.log("query4444444", query)
    //         //     const [rows]: any = await db.query(query);

    //         //     const result: any = { data: rows };

    //         //     if (requireTotalCount) {
    //         //         const countQuery = `SELECT COUNT(*) AS total FROM Users ${where}`;
    //         //         const [countResult]: any = await db.query(countQuery);
    //         //         result.totalCount = countResult[0].total;
    //         //     }

    //         //     res.json(result);

    //         // }

    //         // else {
    //         //     const [rows]: any = await db.query("Select * from Users");
    //         //     res.json({ message: "ALl users", rows });



    //         // }



    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ message: "error", err });
    //     }
    // }

    async fetchUsers(req: Request, res: Response) {
        try {
            const skip = parseInt(req.query.skip as string)
            const take = parseInt(req.query.take as string)

            console.log("Skip11",skip)
            console.log("take11",take)
            const requireTotalCount = req.query.requireTotalCount === "true";

            let where = "";
            let order = "";

            if (req.query.filter) {
                const filter = JSON.parse(req.query.filter as string);
                console.log("kjbdokj",filter)
                if (filter && filter.length > 0) {
                    where = UserController.buildwhere(filter);
                    console.log("jbfijbdjivjijbjfbokg", where)
                }
            }

            if (req.query.sort) {
                const sort = JSON.parse(req.query.sort as string);
                if (sort && sort.length > 0) {
                    order = UserController.buildorder(sort);
                    
                }
            }


            const userRepo = AppDataSource.getRepository(User);
            const query = userRepo.createQueryBuilder("user")
                .skip(skip)
                .take(take);

            if (where!="") query.where(where);
            if (order!="") query.orderBy(order);
    
            const users = await query.getMany();

            if (requireTotalCount) {
                const totalCount = await userRepo.count();
                return res.json({ data: users, totalCount });
            }

            return res.json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }


    async userinfo(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.json({ message: "Authorization header missing" });

        const token = authHeader.split(" ")[1];
        if (!token) return res.json({ message: "Bearer token missing" });

        const secret: string | undefined = process.env.SECRET_KEY;
        if (!secret) return res.json({ message: "Secret key is undefined" });

        try {
            const decoded: any = jwt.verify(token, secret);
            const userId = decoded.id;

            const userRepo = AppDataSource.getRepository(User);
            const info = await userRepo.findOne({ where: { id: userId } });
            console.log(info)

            if (!info) return res.json({ message: "User not found" });

            return res.json({ message: "User Data Fetched", info });
        } catch (err) {
            return res.json({ message: "Error in fetching", err });
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


            const result = await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(User)
                .where("id = :id", { id: userId })
                .execute();

            // const [result]: any = await db.query("DELETE FROM users2 WHERE id = ?", [userId]);
            if (result.affected === 0) return res.json({ message: "User not found" });

            return res.json({ message: "User deleted successfully", id: userId });
        } catch (error) {
            return res.json({ message: "Error deleting user", error });
        }
    }

    async deletebyId(req: Request, res: Response) {
        const { id } = req.params

        try {
            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(User)
                .where("id = :id", { id })
                .execute();
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
            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(User)
                .whereInIds(ids)
                .execute();
            return res.json({ message: `${ids.length} Users Deleted` });
        } catch (err) {
            return res.status(500).json({ message: "Error Deleting Users", err });
        }
    }



    //  async updateUser(req: Request, res: Response) {
    //     const { id, name, username, email } = req.body;

    //     try {
    //         const userRepo=AppDataSource.getRepository(User)

    //         const [user]: any = await db.query("SELECT * FROM users2 WHERE id = ?", [id]);

    //         if (user.length === 0) {
    //             return res.json({ message: "User not found" });
    //         }

    //         await db.query(
    //             "UPDATE users2 SET name = ?, username = ?, email = ? WHERE id = ?",
    //             [name, username, email, id]
    //         );

    //         res.json({ message: "User updated successfully", updatedUser: { id, name, username, email } });
    //     } catch (error) {
    //         res.json({ message: "Error updating user", error });
    //     }
    // }



    async updateUser(req: Request, res: Response) {
        const { id, name, username, email } = req.body;

        try {
            const result = await AppDataSource
                .createQueryBuilder()
                .update(User)
                .set({ name, username, email })
                .where("id = :id", { id })
                .execute();

            if (result.affected === 0) {
                return res.json({ message: "User not found or nothing updated" });
            }

            res.json({ message: "User updated successfully", updatedUser: { id, name, username, email } });
        } catch (error) {
            res.json({ message: "Error updating user", error });
        }
    }



    async adminUpdateUser(req: Request, res: Response) {
        const { id, name, username, email, role } = req.body;

        try {

            const userRepo = AppDataSource.getRepository(User);
            const existingUser = await userRepo.findOne({ where: { id } });

            if (!existingUser) {
                return res.json({ message: "User not found" });
            }

            const updatedUser = {
                name: name ?? existingUser.name,
                username: username ?? existingUser.username,
                email: email ?? existingUser.email,
                role: role ?? existingUser.role
            };

            await AppDataSource
                .createQueryBuilder()
                .update(User)
                .set(updatedUser)
                .where("id = :id", { id })
                .execute();

            res.json({ message: "User updated successfully" });
        } catch (error) {
            res.json({ message: "Error updating user", error });
        }
    }


    async profileUpload(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.json({ message: "No file uploaded" });
            }

            const cloudinaryUrl = req.file.path;
            const { id } = req.body;

            await AppDataSource
                .createQueryBuilder()
                .update(User)
                .set({ profile_pic: cloudinaryUrl })
                .where("id = :id", { id })
                .execute();

            return res.json({ message: "File uploaded successfully", file: cloudinaryUrl });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error uploading file", err });
        }
    }



    async adminadduser(req: Request, res: Response) {




    }







}


export default UserController









