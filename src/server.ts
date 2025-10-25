import express from 'express'
import userRoutes from './routes/userRoutes'
import dotenv from 'dotenv'

const app=express()
dotenv.config()

const port=process.env.PORT||3000

app.use(express.json())
app.use("/users",userRoutes)


app.get("/",(req,res)=>{
    res.send("bfojkdboknb")
})


app.listen(port || 3000,()=>{
    console.log("Server started on "+port)
})