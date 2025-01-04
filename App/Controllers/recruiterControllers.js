import Recruiter from "../Models/recruitermodel.js";
import { validationResult } from "express-validator";
const recruiterCltr = {}
import User from "../Models/userSchema.js"

recruiterCltr.posting = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { companyname, location, website } = req.body;

    try {
        const recruiter = new Recruiter({ companyname, location, website, userId: req.currentUser.userId });
        const user = await User.findById(req.currentUser.userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        recruiter.name = user.name;
        recruiter.email = user.email;
        await recruiter.save();
        
        return res.status(201).json( recruiter );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export default recruiterCltr