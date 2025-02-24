import express from "express"
import configuredb from "./Config/db.js"
import userRouter from "./Routes/userRoute.js";
import recruiterRouter from "./Routes/recruiterRoute.js"
import candidateRouter from "./Routes/candidateRoute.js"
import resumebuilderRouter from "./Routes/resumebuilderRoute.js"
import jobRouter from "./Routes/jobRouter.js"
import questionRouter from "./Routes/questionRoutes.js"
import jobApplicationRouter from "./Routes/jobApplicationRouter.js"
import interviewRouter from "./Routes/interviewRoute.js"
import jobFairRouter from "./Routes/jobFairRoute.js"
import paymentRouter from "./Routes/paymentRoute.js"
import supportRouter from "./Routes/supportRoute.js"
import  dotenv from "dotenv";
import cors from "cors"
const app=express()
app.post("/api/webhooks", express.raw({ type: "application/json" }));
app.use(express.json()); 
app.use(cors())
dotenv.config()
const port =4010
configuredb()



app.use("/api",userRouter)
app.use("/api",recruiterRouter)
app.use("/api",candidateRouter)
app.use("/api",resumebuilderRouter)
app.use("/api",jobRouter)
app.use("/api",questionRouter)
app.use("/api",jobApplicationRouter)
app.use("/api",interviewRouter)
app.use("/api",jobFairRouter)
app.use("/api",paymentRouter)
app.use("/api",supportRouter)

app.listen(port,()=>{
    console.log(`${port} has been successfully registered`)
})

export default app