import JobApplication from "../Models/jobapplicationmodel.js";
import Job from "../Models/jobmodel.js"
import Candidate from "../Models/candidatemodel.js";
const jobAppCltr ={}
import { validationResult } from "express-validator";  
import Question from "../Models/questionmodel.js"; 
import cloudinary from "cloudinary"
import fs from "fs"
import jobCltr from "./jobCltr.js";
import User from "../Models/userSchema.js";


cloudinary.config({
    cloud_name: "ds6mdqjnx",
    api_key: "875581487565256",
    api_secret: "5ul0eiEziuZQaksO0dD0js8EDss"
}) 

// jobAppCltr.uploadVideo=async(req,res)=>{
//   try{
//      const file = req.file
//      if(!file||file.length===0){
//         return res.status(400).json({error:"no videos or files being uploaded"})
//      }


//      const result  = await cloudinary.uploader.upload(file.path,{
//         resource_type:"video",
//         folder:"videos",
//          public_id: `video-${Date.now()}`
//      })



//      res.status(200).json({
//         message:"video uploaded successfully",
//         videoUrl: result.secure_url, // Get the secure URL of the uploaded video
//         publicId: result.public_id, 
//      })
//   }
//   catch(err){
//     console.log(err)
//     res.status(500).json("Internal server error")
//   }
// }

jobAppCltr.submitApplication = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!req.files||!req.files["resume"]) {
            return res.status(400).json({ error: "Resume file is required" });
        }

        const resume = req.files["resume"][0];

        const video = req.files["video"]?req.files["video"][0]:null;

        console.log("Uploaded file:", resume);

        const resumeUpload = await cloudinary.uploader.upload(resume.path, {
            resource_type: "raw", 
            folder: "job-applications/resumes",
            public_id: `resume-${Date.now()}`,
        });

        let videoUrl = null;
        if (video){
            const videoUpload = await cloudinary.uploader.upload(video.path, {
                resource_type: "video", 
                folder: "job-applications/videos",
                public_id: `video-${Date.now()}`,
            });
           videoUrl=videoUpload.secure_url
        }
      
      
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(400).json({ error: "Job not found" });
        }

     
        const questions = await Question.find({ jobId });
        if (!questions.length) {
            return res.status(400).json({ error: "No questions found for this job" });
        }

        const randomQuestions = questions[0].questions
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((q)=>({
                questionId:q._id,
                questionText:q.text
            }))

          console.log(randomQuestions)  
        if (!req.currentUser || !req.currentUser.userId) {
            return res.status(400).json({ error: "User ID is missing from request" });
        }

     
        

        
        const existingApplication = await JobApplication.findOne({
            jobId,
            applicantId: req.currentUser.userId,
        });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

       
        const newApplication = new JobApplication({
            jobId,
            applicantId: req.currentUser.userId,
            answeredQuestions: randomQuestions.map((q)=>(
                {
                    questionId:q.questionId,
                    questionText:q.questionText
                }
            )),
            resumeUrl: resumeUpload.secure_url,
            videoUrl
        });

       
        await newApplication.save();

        return res.status(201).json(newApplication);

    } catch (err) {
        console.error("Error in submitApplication:", err.message, err.stack);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};


jobAppCltr.getAppliedJobs=async(req,res)=>{
    try{
        const getappliedjobs = await JobApplication.find({applicantId:req.currentUser.userId}).populate("jobId")
        return res.status(200).json(getappliedjobs) 
    }
    catch(err){
        console.log(err)
        return res.status(500).json("internal server error")
    }
}

jobAppCltr.registeredUsers=async(req,res)=>{
    try{
      const {jobId} = req.params
      const job =await Job.findById(jobId)
      if(!job){
        return res.status(400).json("job not found")
      }
      const jobapplication = await JobApplication.find({ jobId: jobId });

      if (jobapplication.length === 0) {
          return res.status(400).json("No job applications found");
      }
     
      const data = jobapplication.map((ele) => User.findById(ele.applicantId));
      const users = await Promise.all(data);
      
     
      const jobApplicationsWithUsers = jobapplication.map((application, index) => ({
          ...application.toObject(), // Convert mongoose document to plain object
          user: users[index] || null, // Attach corresponding user
      }));
      
      console.log(jobApplicationsWithUsers);
      
      return res.status(200).json(jobApplicationsWithUsers);
      
     
    }
    catch(err){
        console.log(err)
        return res.status(500).json("internal server error")
    }
}

jobAppCltr.verify = async(req,res)=>{
    try{
       const id = req.params.id
       const body =req.body
       const values = ["pending","accepted","rejected"]
       if(!values.includes(body.status)){
        return res.status(400).json("the given status is not being provided")
       }
       const checkId = await JobApplication.findById(id)
       if(!checkId){
        return res.status(400).json("your jobapplication id is not being found")
       }
       const applicants = await JobApplication.findByIdAndUpdate(id,body,{new:true,runValidators:true})
       return res.status(200).json(applicants)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    } 
}

jobAppCltr.saveJobs = async (req, res) => {
    try {
        const { jobId } = req.body; // Extract `jobId` from `req.body`
        console.log(jobId);

        if (!jobId) {
            return res.status(400).json("jobId is required");
        }

        const candidate = await Candidate.findOne({ userId: req.currentUser.userId });
        console.log(candidate);

        if (!candidate) {
            return res.status(400).json("Candidate not found");
        }

        // Check if the job is already saved
        if (candidate.saveJobs.includes(jobId)) {
            return res.status(400).json("This job is already saved");
        }

        // Push the `jobId` to `saveJobs` array
        candidate.saveJobs.push(jobId);
        await candidate.save();

        return res.status(201).json(candidate);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong");
    }
};

jobAppCltr.gettingSaved=async(req,res)=>{
    try{
        const candidate = await Candidate.findOne({userId:req.currentUser.userId})
        if(!candidate){
            return res.status(400).json("candidate is required")
        }
        const savedIds = candidate.saveJobs
        const displayingJobs = await Promise.all(savedIds.map((ele)=>Job.findById(ele)))
        return res.status(200).json(displayingJobs)    
    }
    catch(err){
        console.log(err);
        return res.status(500).json("Something went wrong"); 
    }
}

jobAppCltr.deletingJobId=async(req,res)=>{
    try{
         const {jobId} = req.params
         const candidate = await Candidate.findOne({userId:req.currentUser.userId})
         if(!candidate){
            return res.status(400).json("candidate is not found")
         }
         candidate.saveJobs= candidate.saveJobs.filter((ele)=>ele.toString()!==jobId)
         await candidate.save()
         return res.status(200).json("job removed from saved job")
    }
    catch(err){
        console.log(err)
        return res.status(500).json("internal server error")
    }
}

export default jobAppCltr