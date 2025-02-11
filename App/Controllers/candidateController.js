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
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ error: errors.array() });
    // }

    try {
        // Check if files are uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded." });
        }

      
        const resumeFiles = await Promise.all(
            req.files.map(async (file) => {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        resource_type: "auto",
                        folder: "resumes",
                    });

            
                    fs.unlink(file.path, (err) => {
                        if (err) console.error("Failed to delete local file", err);
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

candidateCltr.uploadProfilePicture=async(req,res)=>{
    try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
    
        // ✅ Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_pictures",
          width: 300,
          height: 300,
          crop: "fill",
        });
    
        // ✅ Update Candidate Profile
        const candidate = await Candidate.findOneAndUpdate(
          { userId: req.currentUser.userId},
          { profilePicture: result.secure_url },
          { new: true }
        );
    
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
        const candidate = await Candidate.findOne({userId:id}) //populate savedJobs when after working job posting and job applicatoins
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

candidateCltr.update=async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({error:errors.array()})
    }
    try{

        const { mobile, education, skills, certification,  } = req.body
        const id = req.params.id
        const candidate = await Candidate.findOne({userId:id})
        console.log(candidate)
        if(!candidate){
            return res.status(404).json("candidate id is not found")
        }
        if(mobile){
            const mobileNumber = JSON.parse(mobile)
            candidate.mobile=mobileNumber
            
        }
        if(education){
            const educationData = JSON.parse(education)
            candidate.education=candidate.education.map((ele)=>{
               const updateEdu = educationData.find((e)=>e._id==ele._id);
               //ele._id==educationData._id?{...ele,...educationData}:ele
               return updateEdu?{...ele,...updateEdu}:ele
            })
            const newEducation = educationData.filter((ele)=>!candidate.education.some((e)=>e._id==ele._id))//[]
            //candidate.education.push(...newEducation)//[{}, {}, {}].push(newEducation)
            candidate.education =[...candidate.education,...newEducation]
        }
        if(skills){
            const skillsData = JSON.parse(skills)
            candidate.skills =candidate.skills.map((ele)=>{
             const updatedSkills = skillsData.find((e)=>e._id==ele._id)
             return updatedSkills?{...ele,...updatedSkills}:ele
            })
         const newSkills = skillsData.filter((ele)=>!candidate.skills.some((e)=>e._id==ele._id))
         console.log(newSkills)
         //candidate.skills.push(...newSkills)
         candidate.skills = [...candidate.skills, ...newSkills]
        }
       

        if(certification){
            const certificationData = JSON.parse(certification)
            candidate.certification=candidate.certification.map((ele)=>{
             const updatedCertification=certificationData.find((e)=>e._id==ele._id)
                return updatedCertification?{...ele,...updatedCertification}:ele
             })
           
             const newCertification = certificationData.filter(ele=> !candidate.certification.some(e=> e._id == ele._id))
             //candidate.certification.push(...newCertification)
             candidate.certification = [...candidate.certification, ...newCertification]
        }

        // const resumeFiles = await Promise.all(
        //     req.files.map(async (file) => {
        //         try {
                  
        //             const result = await cloudinary.uploader.upload(file.path, {
        //                 resource_type: "auto",
        //                 folder: "resumes",
        //             });

                   
        //             fs.unlink(file.path, (err) => {
        //                 if (err) {
        //                     console.error("Failed to delete local file", err);
        //                 }
        //             });

        //             return {
        //                 filename: result.public_id,
        //                 filepath: result.secure_url,
        //             };
        //         } catch (uploadError) {
        //             console.error("Cloudinary upload failed", uploadError);
        //             throw new Error("File upload to Cloudinary failed.");
        //         }
        //     })
        // );
        //candidate.resumeUpload.push(...resumeFiles)
        // candidate.resumeUpload = [...candidate.resumeUpload, ...resumeFiles]
        await candidate.save()
        return res.json(candidate)

    }
    catch(err){
      console.log(err)
      return res.status(500).json({err:"something went wrong"})
    }
}  

export default candidateCltr;