import Job from "../Models/jobmodel.js";
import Question from "../Models/questionmodel.js";
import Recruiter from "../Models/recruitermodel.js";
import { validationResult } from "express-validator";
const jobCltr = {}


jobCltr.posting = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const {title,description,location,experienceRequired,salaryRange,jobtype,deadline} = req.body

   if(!["parttime","fulltime","freelance","internship"].includes(jobtype)){
    return res.status(404).json("not valid of the jobtype")
   }
   const userdata = await Recruiter.findOne({userId:req.currentUser.userId})

    try{
       const jobPosting = await Job.create({
          title,
          description,
          location,
          experienceRequired,
          salaryRange,
          recruiterId:userdata,
          jobtype,
          deadline
       })
    
    const jobId = await Job.findById(jobPosting._id).populate("recruiterId")
    return res.status(201).json(jobId)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.gettingQuestions = async(req,res)=>{
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId).populate("assignedQuestions"); 
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        const questions = await Question.find({ jobId })
        job.assignedQuestions=questions
   

        return res.status(200).json(job);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export default jobCltr