import express from "express"
import candidateValidator from "../App/Validators/candidateValidator.js"
import candidateCltr from "../App/Controllers/candidateController.js"
import authenticateUser from "../App/Middlewares/authenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"
import { checkSchema } from "express-validator"

const router = express.Router()

router.post("/candidate",authenticateUser,authorizeUser(["candidate"]),checkSchema(candidateValidator),candidateCltr.posting)


export default router