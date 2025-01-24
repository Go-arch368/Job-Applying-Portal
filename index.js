import express from "express"
import configuredb from "./Config/db.js"
import userRouter from "./Routes/userRoute.js";
import recruiterRouter from "./Routes/recruiterRoute.js"
import candidateRouter from "./Routes/candidateRoute.js"
import resumebuilderRouter from "./Routes/resumebuilderRoute.js"
import jobRouter from "./Routes/jobRouter.js"
import questionRouter from "./Routes/questionRoutes.js"
import jobApplicationRouter from "./Routes/jobApplicationRouter.js"
import  dotenv from "dotenv";
dotenv.config()
const port =4010
configuredb()
const app=express()
app.use(express.json())

app.use("/api",userRouter)
app.use("/api",recruiterRouter)
app.use("/api",candidateRouter)
app.use("/api",resumebuilderRouter)
app.use("/api",jobRouter)
app.use("/api",questionRouter)
app.use("/api",jobApplicationRouter)

app.listen(port,()=>{
    console.log(`${port} has been successfully registered`)
})

export default app