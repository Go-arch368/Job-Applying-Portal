import express from "express"
import recruiterValidator from "../App/Validators/recruiterValidators.js"
import recruiterCltr from "../App/Controllers/recruiterControllers.js"
import authenticateUser from "../App/Middlewares/authenticateUser.js"
import idValidation from "../App/Validators/idValidation.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"
import { checkSchema } from "express-validator"

const router = express.Router()

router.post("/recruiter",authenticateUser,authorizeUser(["recruiter"]),checkSchema(recruiterValidator),recruiterCltr.posting)
router.get("/verify/recruiter",authenticateUser,authorizeUser(["admin"]),recruiterCltr.verify)
router.put("/verify/recruiter/:id",authenticateUser,authorizeUser(["admin"]),checkSchema(idValidation),recruiterCltr.update)
router.delete("/delete/recruiter/:id",authenticateUser,authorizeUser(["admin"]),checkSchema(idValidation),recruiterCltr.destroy)
router.get("/getbyId/:id",authenticateUser,recruiterCltr.getbyId)
export default router