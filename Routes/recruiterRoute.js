import express from "express"
import recruiterValidator from "../App/Validators/recruiterValidators.js"
import recruiterCltr from "../App/Controllers/recruiterControllers.js"
import authenticateUser from "../App/Middlewares/authenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"
import { checkSchema } from "express-validator"

const router = express.Router()

router.post("/recruiter",authenticateUser,authorizeUser(["recruiter"]),checkSchema(recruiterValidator),recruiterCltr.posting)

export default router