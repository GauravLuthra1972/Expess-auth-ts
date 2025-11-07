import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "bababubu",
    database: "Usersauth",
    synchronize: false, 
    logging: false,
    entities: [User,Post],
     migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
