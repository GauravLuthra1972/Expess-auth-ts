import express from 'express'
import userRoutes from './routes/userRoutes'


const app=express()
const port=8080

app.use(express.json())
app.use("/users",userRoutes)


app.get("/",(req,res)=>{
    res.send("bfojkdboknb")
})


app.listen(port,()=>{
    console.log("Server started on"+port)
})