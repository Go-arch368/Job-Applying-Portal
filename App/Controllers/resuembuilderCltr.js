import Resumebuilder from "../Models/resumebuilder.js";

import { validationResult } from "express-validator";

const resumeCltr = {};

// Handle resume details submission
resumeCltr.resumedetails = async (req, res) => {
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 

    const {personalInfo,education,workExperience,skills,certification,project,visibility} = req.body;
    if(!["public","private","restricted"].includes(visibility)){
        return res.status(400).json({error:"Invalid visibility value"})
    }
   
    try{

        const existedResume = await Resumebuilder.findOne({createdBy:req.currentUser.userId})
        if(existedResume){
            return res.status(400).json({message:"the resume already created by the candidate"})
        }
        const resume = new Resumebuilder(
            {
                personalInfo,
                education,
                workExperience,
                skills,
                certification,
                project,
                visibility,
                userId : req.currentUser.userId,
                createdBy : req.currentUser.userId
            }
        )
        await resume.save()
        const findingId = await Resumebuilder.findById(resume._id).populate("userId")

        //console.log(resume)
        
        return res.status(201).json(findingId)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
};

resumeCltr.update = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 
    const id = req.params.id
    const {visibility,...updateData} = req.body

    if (visibility && !["public", "private", "restricted"].includes(visibility)) {
        return res.status(400).json({ error: "Invalid visibility value." });
    }

    try{
      const updateResume = await Resumebuilder.findByIdAndUpdate(id,updateData,{new:true,runValidators:true})
      updateResume.visibility = visibility

      if(!updateResume){
        return res.status(404).json("resume not found")
      }
      res.status(200).json(updateResume)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("internal server error")
    }
}

resumeCltr.access = async(req,res)=>{
    try{
         const id = req.params.id
         const resume = await Resumebuilder.findById(id).populate("userId","name email")
         if(!resume){
            return res.status(404).json("resume not found")
         }
         if(resume.visibility=="private"&&req.currentUser.userId!=resume.userId.toString()){
                return res.status(403).json("your not authorized to view this resume")
         }
      /*    if(resume.visibility=="restricted"){
            const hasPermission = await JobApplication.exi
         } */  //needed to when creating a jobapplication model 
            res.status(200).json(resume)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("internal server error")
    }
}
resumeCltr.updatevisibility =async(req,res)=>{
    try{
       const id = req.params.id
       const {visibility} = req.body
       if (!["public", "private", "restricted"].includes(visibility)) {
        return res.status(400).json({ error: "Invalid visibility value." });
    }
    const resume = await Resumebuilder.findById(id)
    if(!resume){
        return res.status(404).json("resume not found")
    }
    if(resume.userId!=req.currentUser.userId){
        return res.status(403).json("access denied")
    }
    resume.visibility = visibility
    await resume.save()
    return res.status(200).json(resume)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("internal server error")
    }
}
resumeCltr.search = async (req, res) => {
    try {
        const { personalInfo, workExperience, skills } = req.query;

        const filter = {
            visibility: { $ne: "private" }, // Exclude private resumes
        };

        const orConditions = [];

        
        if (skills) {
            orConditions.push({
                "skills.skillName": { $in: skills.split(",").map((skill) => skill.trim()) },
            });
        }

        // Work experience filter (if provided)
        if (workExperience) {
            orConditions.push({
                "workExperience.experience": { $gte: parseInt(workExperience, 10) },
            });
        }

        if (personalInfo) {
            orConditions.push({
                "personalInfo.location": new RegExp(`^${personalInfo}$`, "i"), 
            });
        }
        if (orConditions.length > 0) {
            filter["$or"] = orConditions;
        }

        console.log(filter); // Debugging

        const resumes = await Resumebuilder.find(filter).populate("userId", "name email");

        if (resumes.length === 0) {
            return res.status(404).json({ message: "No resumes found matching the criteria." });
        }

        return res.status(200).json(resumes);
    } catch (err) {
        console.error("Error in resume search:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default resumeCltr;

/* 
const {workExperience,location,skills} = req.query
const filter ={
  visibility :{$ne:"private"}
}

const orConditions =[]

if(skills){
   orConditions.push({
     "skills.skillName" :{$in:skill.split(",").map((ele)=>ele.trim())}
   })
}

if()


 */
