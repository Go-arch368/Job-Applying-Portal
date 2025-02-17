import Job from "../Models/jobmodel.js";
import Question from "../Models/questionmodel.js";
import Recruiter from "../Models/recruitermodel.js";
import { validationResult } from "express-validator";
import User from "../Models/userSchema.js";
import sendEmail from "../../Config/emailService.js";
const jobCltr = {}




jobCltr.posting = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { jobtitle, description, experienceRequired, salary, jobtype, deadline, skillsrequired,noofOpenings,location } = req.body;
    console.log(req.body)

    if (!["parttime", "fulltime", "freelance", "internship"].includes(jobtype)) {
        return res.status(400).json({ error: "Invalid job type" });
    }

    try {
        // Find recruiter to get location and company name
        const recruiter = await Recruiter.findOne({ userId: req.currentUser.userId });
        const user = await User.findById(req.currentUser.userId)
        console.log(user)
        //console.log(recruiter.email)
        if (!recruiter) {
            return res.status(400).json({ error: "Recruiter not found" });
        }

        if(recruiter.isSubscribed&&recruiter.subscriptionExpiry<new Date()){
                recruiter.isSubscribed =false;
                recruiter.subscriptionPlan="free";
                recruiter.jobPostingLimit=5;
                await recruiter.save()
        }
        
        if(!recruiter.isSubscribed&&recruiter.totalJobPosts>=recruiter.jobPostingLimit){
            return res.status(400).json({error:"Job posting limit reached. Subscribe to post more jobs"})
        }

        // Create the job posting
        const jobPosting = await Job.create({
            jobtitle,
            description,
            location,
            companyname: recruiter.companyname,
            noofOpenings,
            experienceRequired,
            skillsrequired,
            salary,
            recruiterId: recruiter._id,
            jobtype,
            deadline,
            clicks:0,
            email:user.email
        });

        if(!recruiter.isSubscribed){
          recruiter.totalJobPosts+=1
           await  recruiter.save()
        }

        if(recruiter.totalJobPosts==3){
            await sendEmail(user.email,
                 "🚀 Running Out of Free Job Posts!", 
                   "You have only 3 job posts left. Upgrade now to continue posting unlimited jobs. [Upgrade Now]"
            )
          }
   
          if(recruiter.totalJobPosts==5){
           await sendEmail(user.email,
                "⚠️ No Free Job Posts Left!", 
                   "You've used all your free job posts. Upgrade now to continue posting. [Upgrade Now]"
           )
          }
        

        return res.status(201).json(jobPosting);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

jobCltr.updateJob=async(req,res)=>{
    try{
        const {jobId} = req.params
        const updateData = req.body
        const updatejob = await Job.findByIdAndUpdate(jobId,updateData,{new:true,runValidators:true})
        console.log(updatejob)
        if(!updatejob){
            return res.status(400).json({error:"update job is not being found"})
        }
        return res.status(200).json(updatejob)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.deleteJob=async(req,res)=>{
    try{
       const {jobId} = req.params
       const deleteJob = await Job.findByIdAndDelete(jobId,{new:true})
       if(!deleteJob){
         return res.status(500).json({error:"Your job is not found"})
       }
       return res.status(200).json(deleteJob)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"something went wrong"})
    }
}


jobCltr.gettingQuestions = async(req,res)=>{
    try {
        const { jobId } = req.params;
        //const questions = await Question.findOne({jobId:req.param})
        // const job = await Job.findById(jobId)
        // if (!job) {
        //     return res.status(404).json({ error: "Job not found" });
        // }
       const questions = await Question.find({ jobId })
       let data=questions[0].questions
       const randomQuestions = data.sort(()=>0.5-Math.random()).slice(0,3)//compare shuffle
      console.log(randomQuestions)
        //job.assignedQuestions=questions 
     return res.status(201).json(randomQuestions)

       // return res.status(200).json(job);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

jobCltr.getAll=async(req,res)=>{
    try{
    
        const recruiter = await Recruiter.findOne({userId:req.currentUser.userId})
        if(!recruiter){
            return res.status(400).json("no recruiter is being found")
        }
       
       // console.log(question.questions)
        if(req.currentUser.role==="recruiter"){
            const jobs = await Job.find({recruiterId:recruiter._id}).lean()
         // console.log(job);
            if(!jobs){
                return res.status(400).json("No job posting is found for this recruiter")
            }
            const questions = await Question.find({createdBy:recruiter._id})
            if(!questions){
                return res.status(400).json("no quesitions is found for these job")
            }
        //    const questionData = question.map((ele)=>ele.questions).flat()
        //    const viewQuestions =  questionData.map((ele)=>ele.questionText)
        //    console.log(viewQuestions)

           const jobsWithQuestions = jobs.map((job) => {
            const matchedQuestions = questions
                .filter((q) => q.jobId.toString() === job._id.toString())
                .flatMap((q)=>q.questions.map((ele)=>ele.questionText)) // Match job ID
                 // Extract question qtexts

            return {
                ...job,
                assignedQuestions: matchedQuestions
            };
        });
           console.log(jobsWithQuestions)
     
       
         
            return res.status(200).json(jobsWithQuestions)
        }
        else if(req.currentUser.role=="admin"){
            const fetchAll = await Job.find()
            return res.status(200).json(fetchAll)
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.searching = async (req, res) => {
    try {
      const { jobtitle, location } = req.query;
      console.log("Received query parameters:", jobtitle, location);
  
      let query = {};
      if (jobtitle) query.jobtitle = { $regex: jobtitle, $options: "i" };
      if (location) query.location = { $regex: location, $options: "i" };
  
      if (!jobtitle && !location) {
        return res.status(400).json({ message: "At least fill one input field" });
      }
  
      // Fetch jobs and populate recruiter details
      const filtering = await Job.find(query)
        .populate({ path: "recruiterId", select: "subscriptionPlan " });
  
      console.log("Populated Jobs:", filtering);
  
      // Remove expired jobs
      const jobs = filtering.filter((ele) => new Date(ele.deadline) >= new Date());
  
      if (jobs.length === 0) {
        return res.status(404).json("No documents found");
      }
  
      // Sort jobs by subscription plan priority
      const priorityOrder = { gold: 1, silver: 2, basic: 3, free: 4 };
      jobs.sort((a, b) => priorityOrder[a.recruiterId?.subscriptionPlan] - priorityOrder[b.recruiterId?.subscriptionPlan]);
  
      // Fetch questions and format response
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
  
      return res.json(gettingQuestions);
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json("Something went wrong");
    }
  };
  
  
  

jobCltr.incrementJobclicks=async(req,res)=>{
    try{
        const {jobId} =req.params
        console.log(jobId)
        const job = await Job.findByIdAndUpdate(jobId,{$inc:{clicks:1}},{new:true})
        console.log(job)
        if(!job){
            return res.status(400).json({error:"no jobs found"})
        }
        return res.json(job)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.getjobDetails=async(req,res)=>{
    try{
        const {jobId} = req.params
        const job = await Job.findById(jobId)
        if(!job){
            return res.status(400).json(job)
        }
        return res.status(200).json(job)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}


export default jobCltr