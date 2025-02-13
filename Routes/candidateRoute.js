import express from "express"
import candidateValidator from "../App/Validators/candidateValidator.js"
import candidateCltr from "../App/Controllers/candidateController.js"
import authenticateUser from "../App/Middlewares/AuthenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"
import { checkSchema } from "express-validator"
import upload from "../App/Middlewares/Multer.js"

const router = express.Router()

router.post("/candidate",authenticateUser,authorizeUser(["candidate"]),upload.fields([{ name: "resume", maxCount: 1 }]),candidateCltr.posting);
router.post("/candidate/upload-profile",authenticateUser,authorizeUser(["candidate"]),upload.single("profilePicture"),candidateCltr.uploadProfilePicture)
router.get("/candidate/:id",authenticateUser,candidateCltr.getById)
router.put("/candidate/:id",authenticateUser,authorizeUser(["candidate"]),candidateCltr.update)


export default router