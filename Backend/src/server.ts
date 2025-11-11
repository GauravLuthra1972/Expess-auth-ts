import "reflect-metadata";
import express from 'express';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes'
import followRoutes from './routes/followRoutes'


import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'
import {AppDataSource} from "./config/data-source";



dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use("/users", userRoutes);
app.use("/auth",authRoutes)
app.use("/posts",postRoutes)
app.use("/comments",commentRoutes)
app.use("/follow",followRoutes)



app.get("/", (req, res) => {
    res.send("Server is running");
});

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully");

        app.listen(port, () => {
            console.log(`Server running on ${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed", err);
    });