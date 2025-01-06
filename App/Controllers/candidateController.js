import Candidate from "../Models/candidatemodel.js";
import { validationResult } from "express-validator";
const candidateCltr = {};
import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: "ds6mdqjnx",
    api_key: "875581487565256",
    api_secret: "5ul0eiEziuZQaksO0dD0js8EDss"
});

candidateCltr.posting = async (req, res) => {

    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({error:errors.array()})
    }

    try {
        const { mobile, education, skills, certification, saveJobs } = req.body

        const newEducation = JSON.parse(education)
        const newSkills = JSON.parse(skills)
        const newCertification = JSON.parse(certification)
        const newSavedJobs = JSON.parse(saveJobs)
      
         if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded." });
        } 

        console.log(req.files);  

        const resumeFiles = await Promise.all(
            req.files.map(async (file) => {
                try {
                  
                    const result = await cloudinary.uploader.upload(file.path, {
                        resource_type: "auto",
                        folder: "resumes",
                    });

                   
                    fs.unlink(file.path, (err) => {
                        if (err) {
                            console.error("Failed to delete local file", err);
                        }
                    });

                    return {
                        filename: result.public_id,
                        filepath: result.secure_url,
                    };
                } catch (uploadError) {
                    console.error("Cloudinary upload failed", uploadError);
                    throw new Error("File upload to Cloudinary failed.");
                }
            })
        );
        
        const candidate = new Candidate({
            userId: req.currentUser.userId,
            mobile,
            education:newEducation,
            skills:newSkills,
            certification:newCertification,
            saveJobs:newSavedJobs,
            resumeUpload: resumeFiles,
        });

        await candidate.save();
        const populatedCandidate = await Candidate.findById(candidate._id).populate("userId");

        return res.status(201).json(populatedCandidate);
    } catch (err) {
        console.error("Error saving candidate", err);
        return res.status(500).json({ error: "Something went wrong" });
    } 
};


export default candidateCltr;

candidateCltr.getById=async(req,res)=>{
    try{
        const id = req.params.id
        const candidate = await Candidate.findById(id) //populate savedJobs when after working job posting and job applicatoins
        if(!candidate){
            return res.status(404).json({error:"Candidate not found"})
        }
        res.status(200).json(candidate)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"something went wrong"})
    }
}


/* candidateCltr.upload= async (req, res) => {
    console.log(req.files); 
  
    if (!req.files) {
      return res.status(400).json({ error: "No files uploaded" });
    }
  
    return res.status(200).json({
      message: "Files uploaded successfully",
      files: req.files, // Return the file details
    });
  };
   */
