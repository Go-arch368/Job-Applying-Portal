import express from "express"
import interviewCltr from "../App/Controllers/interviewController.js"
import authenticateUser from "../App/Middlewares/AuthenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"

const router = express.Router()

router.post("/schedule",authenticateUser,authorizeUser(["recruiter"]),interviewCltr.scheduleInterview)
router.get("/scheduled/interviews",authenticateUser,authorizeUser(["candidate"]),interviewCltr.interviewDetails)
export default router