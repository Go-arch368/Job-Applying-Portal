import express from "express"
import authenticateUser from "../App/Middlewares/AuthenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"
import questionCltr from "../App/Controllers/questionController.js"
import questionValidation from "../App/Validators/questionValidation.js"
import idValidation from "../App/Validators/idValidation.js"
import { checkSchema } from "express-validator"


const router = express.Router()

router.post("/question",authenticateUser,authorizeUser(["recruiter"]),questionCltr.create)
router.put("/questions/:jobId",authenticateUser,authorizeUser(["recruiter"]),questionCltr.update)
router.get("/questions/:jobId",authenticateUser,authorizeUser(["recruiter"]),questionCltr.getById)
router.delete("/job/:jobId/questions/:questionId",authenticateUser,authorizeUser(["recruiter"]),questionCltr.deletewithJob)

export default router