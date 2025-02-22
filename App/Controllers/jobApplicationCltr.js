import JobApplication from "../Models/jobapplicationmodel.js";
import Job from "../Models/jobmodel.js"
import Candidate from "../Models/candidatemodel.js";
const jobAppCltr ={}
import { validationResult } from "express-validator";  
import Question from "../Models/questionmodel.js"; 
import cloudinary from "../../Config/cloudinary.js";
import fs, { accessSync } from "fs"
import jobCltr from "./jobCltr.js";
import User from "../Models/userSchema.js";
import nodemailer from "nodemailer"





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
        const { jobId } = req.params;
        const { answeredQuestions } = req.body;
        let parsedAnswers = JSON.parse(answeredQuestions);
        console.log(parsedAnswers);

        if (!req.files?.["resume"]?.[0]) {
            return res.status(400).json({ error: "Resume file is required" });
        }
    
        const resume = req.files["resume"][0];
    
        // Upload resume to Cloudinary
        const resumeUpload = await cloudinary.uploader.upload(resume.path, {
            resource_type: "raw",
            folder: "job-applications/resumes",
            public_id: `resume-${Date.now()}`,
        });
    
        // Handle video upload
        const video = req.files?.["video"]?.[0];
        let videoUrl = null;
    
        if (video?.mimetype?.startsWith("video/")) {
            try {
                const videoUpload = await cloudinary.uploader.upload(video.path, {
                    resource_type: "auto",
                    folder: "job-applications/videos",
                    public_id: `video-${Date.now()}`,
                });
    
                videoUrl = videoUpload.secure_url;
            } catch (error) {
                console.error("Error uploading video:", error.message);
                return res.status(500).json({ error: "Error uploading video" });
            }
        }
    
        // Check if job exists
        const job = await Job.findById(jobId).populate("recruiterId")
        console.log("kjsad",job.email)
        if (!job) {
            return res.status(400).json({ error: "Job not found" });
        }
    
      

        // Prevent duplicate applications
        const existingApplication = await JobApplication.findOne({
            jobId,
            applicantId: req.currentUser.userId,
        });
    
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }
    
        const user = await User.findById( req.currentUser.userId );
        console.log(user)
        // Create job application
        const newApplication = new JobApplication({
            jobId: job._id,
            applicantId: user,
            answeredQuestions: parsedAnswers.map(answer => ({
                questionText: answer.questionText,
                startingTimestamp: answer.startingTimeStamps,
            })),
            resumeUrl: resumeUpload.secure_url,
            videoUrl: videoUrl,
        });

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.APP_PASSWORD
            }
        })

        const mailOptions = {
            from : "process.env.EMAIL",
            to: job.email,
            subject:`New Job Application for ${job.jobtitle}`,
            html:`
              <h3>New Job Application Received</h3>
                <p><strong>Job Title:</strong> ${job.jobtitle}</p>
                <p><strong>Applicant Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Resume:</strong> <a href="${resumeUpload.secure_url}">View Resume</a></p>
                ${videoUrl ? `<p><strong>Video:</strong> <a href="${videoUrl}">View Video</a></p>` : ""}
            `
        }

        await transporter.sendMail(mailOptions)
    
        await newApplication.save();
        return res.status(201).json(newApplication);
    } catch (err) {
        console.error("Error in submitApplication:", err.message, err.stack);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};


jobAppCltr.getAppliedJobs=async(req,res)=>{
    try{
        const {search=""} = req.query
        const {sortby="jobtitle"} = req.query
        const {order="asc"} = req.query
        const {page=1} = req.query
        const {limit=4} = req.query
        const pageNum = Number(page)
        const limitNum = Number(limit)
        const searchQuery = {applicantId:req.currentUser.userId}
        const sortQuery = {}
        sortQuery[sortby] = order === "asc"?1:-1

        if(search){
            searchQuery["jobId"] = {
                $in:await Job.find({jobtitle:{$regex:search,$options:"i"}}).select("_id")
            }
        }

        const getappliedjobs = await JobApplication.find(searchQuery)
                                    .populate("jobId")
                                    .sort(sortQuery)
                                    .skip((pageNum-1)*limitNum)
                                    .limit(limitNum)
        if(getappliedjobs.length==0){
            return res.status(400).json({error:"no applied jobs found"})
        }
        const total =await JobApplication.countDocuments({applicantId:req.currentUser.userId})
         res.json({
            data:getappliedjobs,
            total,
            pageNum,
            totalPages:Math.ceil(total/limitNum)
         })
      
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
       console.log(body)
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
        console.log("hi")
        const { jobId } = req.body; // Extract `jobId` from `req.body`
        console.log(jobId);
        if (!jobId) {
            return res.status(400).json({error:"jobId is required"});
        }
        console.log(req.currentUser.userId)

        const candidate = await Candidate.findOneAndUpdate(
            { userId: req.currentUser.userId },      // Find condition
            { $setOnInsert: { userId: req.currentUser.userId } }, // Only sets if creating
            { upsert: true, new: true }              // Create if not found, return new doc
        );
        
        console.log(candidate);
        // if (!candidate) {
        //     return res.status(400).json({error:"Candidate not found"});
        // }
        // Check if the job is already saved
        if (candidate.saveJobs.includes(jobId)) {
            return res.status(400).json({error:"This job is already saved"});
        }
        // Push the `jobId` to `saveJobs` array
        candidate.saveJobs.push(jobId);
        await candidate.save();

        return res.status(201).json({candidate,datasaving:"saved"});
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong");
    }
};

jobAppCltr.gettingSaved = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId:req.currentUser.userId});
        console.log(candidate)
        if (!candidate) {
            return res.status(400).json({ error: "Candidate is required" });
        }
    
        if (!candidate.saveJobs || candidate.saveJobs.length === 0) {
            return res.status(200).json([]); // No saved jobs
        }

        // Ensure all job IDs are valid ObjectIds
        // const validJobIds = candidate.saveJobs.filter((jobId) => mongoose.Types.ObjectId.isValid(jobId));

        // if (validJobIds.length === 0) {
        //     return res.status(400).json({ message: "No valid saved job IDs found" });
        // }

        const displayingJobs = await Promise.all(candidate.saveJobs.map((jobId) => Job.findById(jobId)));

        return res.status(200).json(displayingJobs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
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

jobAppCltr.getAccepted =async(req,res)=>{
  try{
     const {jobId} = req.params
     console.log(jobId)
     const identifyjobs = await Job.findById(jobId)
     console.log(identifyjobs)
     if(!identifyjobs){
        return res.status(400).json({error:"job not found"})
     }
     const acceptedCandidates = await JobApplication.find({jobId,status:"accepted"}).populate("applicantId")
     console.log(acceptedCandidates)
     if(acceptedCandidates.length==0){
        return res.status(400).json({error:"no accepted candidates "})
     }
    return res.status(200).json(acceptedCandidates)
  }
  catch(err){
    console.log(err)
    return res.status(500).json({err:"something went wrong"})
  }
}

jobAppCltr.getRejected = async(req,res)=>{
    try{
        const {jobId} = req.params
        const identifyjobs = await Job.findById(jobId)
        if(!identifyjobs){
           return res.status(400).json({error:"job not found"})
        }
        const rejectedCandidates =await JobApplication.find({jobId,status:"rejected"}).populate("applicantId")
        if(rejectedCandidates.length==0){
           return res.status(400).json({error:"no candidates found"})
        }
       return res.status(200).json(rejectedCandidates)
     }
     catch(err){
       console.log(err)
       return res.status(500).json({err:"something went wrong"})
     }
}

jobAppCltr.getAllApplied = async(req,res)=>{
    try{ 
       
        const candidateApplied = await JobApplication.find({applicantId:req.currentUser.userId}).populate("jobId")
        console.log(candidateApplied);
        const job = await Job.findById(candidateApplied.map((ele)=>ele.jobId))
        if(!candidateApplied){
            return res.status(400).json({error:"candidate not found"})
        }
        return res.json(candidateApplied)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({err:"somethig went wrong"})
    }
}

jobAppCltr.giveSearch = async (req, res) => {
    try {
        const candidate = await Candidate.find({ userId: req.currentUser.userId });
        const skills = candidate.flatMap(ele => ele.skills.map(data => data.skillName));

        let filtering;
        if (skills.length > 0) {
            filtering = await Job.find({
                jobtitle: {
                    $in: skills.map(skill => new RegExp(`^${skill}$`, "i"))
                }
            }).populate({ path: "recruiterId", select: "subscriptionPlan" });
        } else {
            filtering = await Job.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate({ path: "recruiterId", select: "subscriptionPlan" });
        }

      
        const jobs = filtering.filter(ele => new Date(ele.deadline) >= new Date());

        // if (jobs.length === 0) {
        //     return res.status(404).json({ error: "No documents found" });
        // }


        const priorityOrder = { gold: 1, silver: 2, basic: 3, free: 4 };
        jobs.sort((a, b) => priorityOrder[a?.recruiterId?.subscriptionPlan] - priorityOrder[b?.recruiterId?.subscriptionPlan]);

        const gettingQuestions = await Promise.all(
            jobs.map(async (job) => {
                const questions = await Question.find({ jobId: job._id });
                const assignedQuestions = questions.flatMap(q => q.questions.map(qText => qText.questionText));

                return {
                    ...job.toObject(),
                    assignedQuestions,
                };
            })
        );
        console.log(gettingQuestions)
        return res.json({ gettingQuestions });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};


export default jobAppCltr