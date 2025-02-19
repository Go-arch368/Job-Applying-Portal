import express from "express"
import jobCltr from "../App/Controllers/jobCltr.js";
//import jobValidators from "../App/Validators/jobValidators.js";
import authenticateUser from "../App/Middlewares/AuthenticateUser.js";
import authorizeUser from "../App/Middlewares/AuthorizeUser.js";
import idValidation from "../App/Validators/idValidation.js";
import { checkSchema } from "express-validator";

const router = express.Router()

router.post("/jobposting",authenticateUser,authorizeUser(["recruiter"]),jobCltr.posting)
router.get("/job/:jobId/questions",authenticateUser,authorizeUser(["recruiter","candidate"]),jobCltr.gettingQuestions)//using in the job application portal
router.get("/jobs",authenticateUser,authorizeUser(["recruiter","admin"]),jobCltr.getAll)
router.put("/jobs/:jobId",authenticateUser,authorizeUser(["recruiter"]),jobCltr.updateJob)
router.delete("/jobs/:jobId",authenticateUser,authorizeUser(["recruiter"]),jobCltr.deleteJob)
//candidate can able to search for an job :
router.get("/job",authenticateUser,authorizeUser(["candidate"]),jobCltr.searching)
//count the clicks
router.put("/:jobId/click",jobCltr.incrementJobclicks)
router.get("/job/:jobId",authenticateUser,jobCltr.getjobDetails)

//analytics route 
//router.get("/analytics",authenticateUser,authorizeUser(["admin"]),jobCltr.analytics)
router.get("/admin/active-recruiters",authenticateUser,authorizeUser(["admin"]),jobCltr.activeRecruiters)//active recrutiers
router.get("/admin/total-candidates",authenticateUser,authorizeUser(["admin"]),jobCltr.totalCandidates)
router.get("/admin/total-recruiters",authenticateUser,authorizeUser(["admin"]),jobCltr.totalRecruiters)
router.get("/admin/total-jobs",authenticateUser,authorizeUser(['admin']),jobCltr.totalPostings)
router.get("/admin/total-applicants",authenticateUser,authorizeUser(["admin"]),jobCltr.totalApplicants)
router.get("/admin/job-categories",authenticateUser,authorizeUser(["admin"]),jobCltr.jobCategories)
router.get("/admin/active-candidates",authenticateUser,authorizeUser(["admin"]),jobCltr.activeCandidates)
router.get("/admin/application-status",authenticateUser,authorizeUser(["admin"]),jobCltr.applicationStatus)//lfsakjjlkdafdlfsdafl
router.get("/admin/recent-jobs",authenticateUser,authorizeUser(["admin"]),jobCltr.recentJobs)
router.get("/admin/top-applicants",authenticateUser,authorizeUser(["admin"]),jobCltr.topapplicants)
router.get("/admin/job-topapplicants",authenticateUser,authorizeUser(["admin"]),jobCltr.topjobs)

//subscripiton status
router.get("/admin/recruiter-subscription-status",authenticateUser,authorizeUser(["admin"]),jobCltr.subscriptionStatus)
//last ten jobs getting:
router.get("/admin/recentlypostedjobs",authenticateUser,authorizeUser(["admin"]),jobCltr.recentlyPosted)
export default router