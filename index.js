import express from "express"
import configuredb from "./Config/db.js"
import userRouter from "./Routes/userRoute.js";
import  dotenv from "dotenv";
dotenv.config()
const port =4010
configuredb()
const app=express()
app.use(express.json())

app.use("/api/users",userRouter)
app.use("/api/login",userRouter)

app.listen(port,()=>{
    console.log(`${port} has been successfully registered`)
})

export default app