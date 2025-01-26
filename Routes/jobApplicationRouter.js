import express from "express";
import authenticateUser from "../App/Middlewares/AuthenticateUser.js";
import authorizeUser from "../App/Middlewares/AuthorizeUser.js";
import jobAppCltr from "../App/Controllers/jobApplicationCltr.js";
import upload from "../App/Middlewares/Multer.js";

const router = express.Router();

router.post(
    "/apply",
    authenticateUser,
    authorizeUser(["candidate"]),
    upload.fields([
        {name:"resume",maxCount:1},
        {name:"video",maxCount:1}
    ]), 
    jobAppCltr.submitApplication
);

router.get("/applications",authenticateUser,authorizeUser(["candidate"]),jobAppCltr.getAppliedJobs)
router.get("/job/:jobId/applicants",authenticateUser,authorizeUser(["recruiter"]),jobAppCltr.registeredUsers)
router.put("/job/verify/:id", authenticateUser, authorizeUser(["recruiter"]), jobAppCltr.verify);
router.post("/candidate/saved-jobs",authenticateUser,authorizeUser(["candidate"]),jobAppCltr.saveJobs)
router.get("/job/saved", authenticateUser,authorizeUser(["candidate"]), jobAppCltr.gettingSaved);
router.delete("/candidate/saved-jobs/:jobId",authenticateUser,authorizeUser(["candidate"]),jobAppCltr.deletingJobId)

export default router;