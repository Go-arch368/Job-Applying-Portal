import express from "express"
import jobFairCltr from "../App/Controllers/jobFairControllers.js"
import authenticateUser from "../App/Middlewares/AuthenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"

const router = express.Router()

router.post("/create-jobFair",authenticateUser,authorizeUser(["admin"]),jobFairCltr.createJobFair)
router .post("/recruiterpost",authenticateUser,authorizeUser(["recruiter"]),jobFairCltr.recruiterDetails)
router.post("/candidatepost",authenticateUser,authorizeUser(["candidate"]),jobFairCltr.candidateDetails)
router.get("/getregistered/:jobFairId",authenticateUser,authorizeUser(["recruiter","admin"]),jobFairCltr.getAlljobs)
export default router