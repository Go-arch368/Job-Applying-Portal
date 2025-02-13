import Candidate from "../Models/candidatemodel.js";
import { validationResult } from "express-validator";
const candidateCltr = {};
import cloudinary from "cloudinary";


// cloudinary.config({
//     cloud_name: "ds6mdqjnx",
//     api_key: "875581487565256",
//     api_secret: "5ul0eiEziuZQaksO0dD0js8EDss"
// });

candidateCltr.posting = async (req, res) => {
    try {
        console.log("Uploaded files:", req.files);

        // if (!req.files?.["resume"]?.[0]) {
        //     return res.status(400).json({ error: "Resume file is required" });
        // }

        // const resume = req.files["resume"][0]; // ✅ Consistent with previous implementation
    
        // const resumeUpload = await cloudinary.uploader.upload(resume.path, {
        //     resource_type: "raw",
        //     folder: "job-applications/resumes",
        //     public_id: `resume-${Date.now()}`,
        //     format: "pdf",
        // });

        // console.log("Cloudinary Upload Result:", resumeUpload);

        const userId = req.currentUser.userId;
        let candidate = await Candidate.findOne({ userId });

        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found." });
        }

        candidate.resumeUpload = req.files.resume[0].path;
        await candidate.save();

        return res.status(200).json({
            message: "Resume uploaded successfully",
            resumeUrl: candidate.resumeUpload,
        });

    } catch (uploadError) {
        console.error("Cloudinary Upload Failed:", uploadError);
        return res.status(500).json({ error: "File upload to Cloudinary failed." });
    }
};

candidateCltr.uploadProfilePicture=async(req,res)=>{
    try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
        console.log("hello brotha")
    
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_pictures",
          width: 300,
          height: 300,
          crop: "fill",
        });
      
        const candidate = await Candidate.findOneAndUpdate(
          { userId: req.currentUser.userId},
          { profilePicture: result.secure_url },
          { new: true }
        );
        console.log(candidate)
        if (!candidate) {
          return res.status(404).json({ error: "Candidate profile not found" });
        }    
        res.json({ message: "Profile picture uploaded successfully", candidate });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
      }
}


candidateCltr.getById=async(req,res)=>{
    try{
        const id = req.params.id
        const candidate = await Candidate.findOne({userId:id}).populate("userId")//populate savedJobs when after working job posting and job applicatoins
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

  candidateCltr.update = async (req, res) => {
    try {
        console.log("hi")
        const { mobile, education, skills, certification } = req.body;
        const id = req.params.id;
        console.log(req.body)

        const candidate = await Candidate.findOne({ userId: id });

        if (!candidate) {
            return res.status(404).json("Candidate ID not found");
        }

        if (mobile) {
            candidate.mobile = mobile;
        }

        if (education) {
            if (!Array.isArray(education)) {
                return res.status(400).json({ error: "Education must be an array" });
            }

            candidate.education = [
                ...candidate.education.filter(ele => education.some(e => e._id == ele._id)), // Keep existing matches
                ...education.filter(e => !candidate.education.some(ele => ele._id == e._id)) // Add new entries
            ];
        }

        if (skills) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({ error: "Skills must be an array" });
            }

            candidate.skills = [
                ...candidate.skills.filter(ele => skills.some(e => e._id == ele._id)),
                ...skills.filter(e => !candidate.skills.some(ele => ele._id == e._id))
            ];
        }

        if (certification) {
            if (!Array.isArray(certification)) {
                return res.status(400).json({ error: "Certification must be an array" });
            }

            candidate.certification = [
                ...candidate.certification.filter(ele => certification.some(e => e._id == ele._id)),
                ...certification.filter(e => !candidate.certification.some(ele => ele._id == e._id))
            ];
        }

        await candidate.save();

        return res.json(candidate);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export default candidateCltr;