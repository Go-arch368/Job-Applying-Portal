import express from "express"
import candidateValidator from "../App/Validators/candidateValidator.js"
import candidateCltr from "../App/Controllers/candidateController.js"
import authenticateUser from "../App/Middlewares/authenticateUser.js"
import authorizeUser from "../App/Middlewares/AuthorizeUser.js"
import { checkSchema } from "express-validator"
import upload from "../App/Middlewares/Multer.js"

const router = express.Router()

router.post("/candidate", authenticateUser, authorizeUser(["candidate"]), upload.array("resume", 5), checkSchema(candidateValidator), candidateCltr.posting)
//router.post("/candidate/upload",authenticateUser,authorizeUser(["candidate"]),upload.array("resume",5),candidateCltr.upload)
router.get("/candidate/:id",authenticateUser,candidateCltr.getById)


export default router