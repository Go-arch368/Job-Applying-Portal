import express from "express"
import jobFairCltr from "../App/Controllers/jobFairControllers.js"
import authenticateUser from "../App/Middlewares/AuthenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"

const router = express.Router()

router.post("/create-jobFair",authenticateUser,authorizeUser(["admin"]),jobFairCltr.createJobFair)//create
router .post("/recruiterpost",authenticateUser,authorizeUser(["recruiter"]),jobFairCltr.recruiterDetails)//recruiter postingdetails
router.post("/candidatepost",authenticateUser,authorizeUser(["candidate"]),jobFairCltr.candidateDetails)//candidate postinghis details 
router.get("/getregistered/:jobFairId",authenticateUser,authorizeUser(["recruiter","admin","candidate"]),jobFairCltr.getAlljobs)//with the recrutier job fairseein all the recruiter who applied for the job
router.get("/jobFair",authenticateUser,authorizeUser(["admin","recruiter","candidate"]),jobFairCltr.getAllJobFair)//get the all the jobfair being created
router.put("/:jobFairId/jobFairs",authenticateUser,authorizeUser(["admin"]),jobFairCltr.updateJobFair)
router.delete("/:jobFairId/jobFairs",authenticateUser,authorizeUser(['admin']),jobFairCltr.deleteJobFair)
export default router