import express from "express"
import { userValidations, loginValidation } from "../App/Validators/userValidation.js"
//import idValidation from "../App/Validators/idValidation.js"
import userCltr from "../App/Controllers/userControllers.js"
import {checkSchema} from "express-validator"
import authenticateUser from "../App//Middlewares/AuthenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"
import upload from "../App/Middlewares/Multer.js"
import userpassCltr from "../App/Controllers/userPassController.js"
//import authorizeUser from "../App//App/Middlewares/AuthorizeUser.js"
const router = express.Router()

router.post("/users",checkSchema(userValidations),userCltr.register)
router.post("/login",checkSchema(loginValidation),userCltr.loginUser)
router.get("/userDetails",authenticateUser,userCltr.getUserData)
//router.get("/getall",userCltr.getAll)
//router.get("/verifyall",userCltr.verify)
//router.put("/verify/recruiter/:id",authenticateUser,authorizeUser(["admin"]),checkSchema(idValidation),userCltr.updateRecruiter)
router.put("/userDetailsPost",authenticateUser,authorizeUser(["admin"]),upload.single("profile"),userCltr.postDetails)
//reset password
router.post("/resetPassword",userpassCltr.resetPassword)


export default router
