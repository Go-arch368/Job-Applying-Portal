import express from "express";
import authenticateUser from "../App/Middlewares/AuthenticateUser.js";
import authorizeUser from "../App/Middlewares/AuthorizeUser.js";
import jobAppCltr from "../App/Controllers/jobApplicationCltr.js";
import upload from "../App/Middlewares/Multer.js";

const router = express.Router();

router.post(
    "/apply/:jobId",
    authenticateUser,
    authorizeUser(["candidate"]),
    upload.fields([
        {name:"resume",maxCount:1},
        {name:"video",maxCount:1}
    ]), 
    jobAppCltr.submitApplication
);

router.get("/applied/jobs",authenticateUser,authorizeUser(["candidate"]),jobAppCltr.getAppliedJobs)//get applied jobs canidate
router.get("/job/:jobId/applicants",authenticateUser,authorizeUser(["recruiter"]),jobAppCltr.registeredUsers)//recruiter will get the candidate for the particular job
router.put("/job/verify/:id", authenticateUser, authorizeUser(["recruiter"]),jobAppCltr.verify);
router.post("/candidate/saved-jobs",authenticateUser,authorizeUser(["candidate"]),jobAppCltr.saveJobs)
router.get("/savedjobs", authenticateUser,authorizeUser(["candidate"]), jobAppCltr.gettingSaved);
router.delete("/candidate/saved-jobs/:jobId",authenticateUser,authorizeUser(["candidate"]),jobAppCltr.deletingJobId)
//get the accepted candidates
router.get("/job/:jobId/accepted",authenticateUser,authorizeUser(["recruiter"]),jobAppCltr.getAccepted)
//get the rejected candidates
router.get("/job/:jobId/rejected",authenticateUser,authorizeUser(["recruiter"]),jobAppCltr.getRejected)
//get applied jobs of the candidate

//get all applied jobs of the candidate
router.get("/getAllApplied/:candidateId",authenticateUser,jobAppCltr.getAllApplied)



export default router;