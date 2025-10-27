import express from 'express';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'



dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true
}));

app.use("/users", userRoutes);



app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log("Server started on " + port);
});
