import express from "express"
import recruiterValidator from "../App/Validators/recruiterValidators.js"
import recruiterCltr from "../App/Controllers/recruiterControllers.js"
import authenticateUser from "../App/Middlewares/AuthenticateUser.js"
import idValidation from "../App/Validators/idValidation.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"
import { checkSchema } from "express-validator"
import upload from "../App/Middlewares/Multer.js"

const router = express.Router()

router.post("/recruiter",authenticateUser,authorizeUser(["recruiter"]),checkSchema(recruiterValidator),recruiterCltr.posting)
router.get("/verify/recruiter",authenticateUser,authorizeUser(["admin"]),recruiterCltr.verify)
router.put("/verify/recruiter/:id",authenticateUser,authorizeUser(["admin"]),checkSchema(idValidation),recruiterCltr.update)
router.delete("/delete/recruiter/:id",authenticateUser,authorizeUser(["admin"]),checkSchema(idValidation),recruiterCltr.destroy)
router.get("/getbyId/:id",authenticateUser,recruiterCltr.getbyId)
//creating routes for profile model:
router.post("/recruiter-profile",authenticateUser,authorizeUser(["recruiter"]),upload.single("companyLogo"),recruiterCltr.createRecruiter)
router.get("/recruiter/:id",authenticateUser,authorizeUser(["recruiter"]),recruiterCltr.getRecruiterById)
router.put("/recruiter/:id",authenticateUser,authorizeUser(["recruiter"]),recruiterCltr.updateData)
//subscription route 
router.post("/subscription/plan",authenticateUser,authorizeUser(["recruiter","admin"]),recruiterCltr.upgradeSubscription)
//getting the details of recruiter
router.get("/getrecruiter",authenticateUser,authorizeUser(["recruiter"]),recruiterCltr.getRecruiterDetails)
export default router