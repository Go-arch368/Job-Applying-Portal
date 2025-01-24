import express from "express";
import resumebuilder from "../App/Validators/resumebuilder.js"; 
import authenticateUser from "../App/Middlewares/AuthenticateUser.js";
import authorizeUser from "../App/Middlewares/AuthorizeUser.js";
import resumeCltr from "../App/Controllers/resuembuilderCltr.js";
import { checkSchema } from "express-validator";

const router = express.Router();

                         // Route to handle resume submission
router.post("/resumedetails", authenticateUser,authorizeUser(["candidate"]),checkSchema(resumebuilder),resumeCltr.resumedetails);
router.put("/resumedetails/:id",authenticateUser,authorizeUser(["candidate"]),checkSchema(resumebuilder),resumeCltr.update);
router.get("/accessresume/:id",resumeCltr.access)
router.put("/resume/:id/visibility",authenticateUser,authorizeUser(["candidate"]),resumeCltr.updatevisibility)
router.get("/resumes/search",resumeCltr.search)
export default router;
