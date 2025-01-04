import express from "express"
import {userValidations} from "../App/Validators/userValidation.js"
import { loginValidation } from "../App/Validators/userValidation.js"
import userCltr from "../App/Controllers/userControllers.js"
import {checkSchema} from "express-validator"
const router = express.Router()

router.post("/",checkSchema(userValidations),userCltr.register)
router.post("/",checkSchema(loginValidation),userCltr.login)

export default router