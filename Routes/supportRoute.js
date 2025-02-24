import express from "express"
import authenticateUser from "../App/Middlewares/AuthenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"
import supportCltr from "../App/Controllers/supportController.js"
const router = express.Router()

router.post("/raise-query",authenticateUser,authorizeUser(["candidate"]),supportCltr.raisequery)
router.get("/recruiter-queries",authenticateUser,authorizeUser(["recruiter"]),supportCltr.recruiterqueries)
router.post("/reply-query",authenticateUser,authorizeUser(["recruiter"]),supportCltr.replyquery)
router.get("/candidate-response/:jobId",authenticateUser,authorizeUser(["candidate"]),supportCltr.candidateresponse)
export default router
