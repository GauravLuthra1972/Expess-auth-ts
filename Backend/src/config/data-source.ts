import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { Follow } from "../entities/Follow";
import { Like } from "../entities/Like";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "bababubu",
    database: "SocialSphere1",
    synchronize: false, 
    logging: false,
    entities: [User,Post,Comment,Follow,Like],
     migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
