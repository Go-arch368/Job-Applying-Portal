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
//candidate can able to search for an job :
router.get("/job",authenticateUser,authorizeUser(["candidate"]),jobCltr.searching)

export default router