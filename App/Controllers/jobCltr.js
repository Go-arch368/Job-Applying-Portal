import Job from "../Models/jobmodel.js";
import Question from "../Models/questionmodel.js";
import Recruiter from "../Models/recruitermodel.js";
import { validationResult } from "express-validator";
import User from "../Models/userSchema.js";
import JobApplication from "../Models/jobapplicationmodel.js";
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

// jobCltr.analytics =async(req,res)=>{
//     try{
//         const totalJobPosts = await Job.countDocuments()
//         const activeRecruiters = 
//     }
//     catch(err){
//         console.log(err)
//         return res.status(500).json("something went wrong")
//     }
// }


jobCltr.activeRecruiters = async(req,res)=>{
    try {
        console.log("hi");
    
        // Fetch distinct recruiter IDs
        const activeRecruiters = await Job.distinct("recruiterId");
    
        // Fetch jobs associated with those recruiters
      const jobs = await Job.find({ recruiterId: { $in: activeRecruiters } }).populate("recruiterId");
      console.log(jobs)
      const data = jobs.map((ele) => ele.recruiterId.userId); // Assuming 'userId' is a field in the Recruiter model
       const recruiter = await User.find({_id:{$in:data}})
        console.log(recruiter);
        
        // Return the results with job and recruiter details
        res.json({ success: true, job:jobs, recruiterData:recruiter });
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.totalCandidates = async (req, res) => {
    try {
        const totalCandidates = await User.find({ role: "candidate" });
        const candidateIds = totalCandidates.map(candidate => candidate._id);
        const jobApplications = await JobApplication.find({ applicantId: { $in: candidateIds } }).populate("jobId");  
        console.log(jobApplications)
        res.json({ success: true, totalCandidates, jobApplications });
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong");
    }
};

jobCltr.totalRecruiters = async(req,res)=>{
    try{
        const totalRecruiters = await User.find({role:"recruiter"})
        if (!totalRecruiters.length) {
            return res.status(404).json({error: "No recruiters found" });
        }
        
        const recruiterIds = totalRecruiters.map((ele)=>ele._id)
        const user = await Recruiter.find({userId:{$in:recruiterIds}}).populate("userId")
        const datafetching  = user.map((ele)=>ele._id)
        //console.log(datafetching)
        const job = await Job.find({recruiterId:{$in:datafetching}})
        console.log(job)
        return res.json({user,job})
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.totalPostings = async(req,res)=>{
    try{
        const totalJobs = await Job.countDocuments()
        res.json({success:true,count:totalJobs})
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.totalApplicants = async(req,res)=>{
    try{
        const totalApplications = await JobApplication.countDocuments()
        res.json({ success: true, count: totalApplications });
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.jobCategories = async(req,res)=>{
    try{
        const jobCategories = await Job.aggregate([
            {$group:{_id:"$jobtitle",count:{$sum:1}}},
            {$sort:{count:-1}}
        ])
        res.json({success:true,data:jobCategories})
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.activeCandidates = async(req,res)=>{
    try{
        const activeCandidates = await JobApplication.distinct("applicantId")
        res.json({success:true,count:activeCandidates.length})
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.applicationStatus = async(req,res)=>{
    try{
        const applicationStatus = await JobApplication.aggregate([
            {$group:{_id:"$status",count:{$sum:1}}}
        ])
        return res.json({success:true,data:applicationStatus})
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")  
    }
}

jobCltr.recentJobs = async(req,res)=>{
    try{
        const recentJobs = await Job.find({
            createdAt:{$gte:new Date(new Date()-7*24*60*60*1000)}
        })
        res.json({success:true,data:recentJobs})
    }
    catch(err){
        console.log(err);
        return res.status(500).json("something went wrong")   
    }
}

jobCltr.topapplicants = async(req,res)=>{
    try{
        const topApplicants = await JobApplication.aggregate([
            {$group:{_id:"$userId",totalApplications:{$sum:1}}},
            {$sort:{totalApplications:-1}},
            {$limit:5}
        ])
        res.json({success:true,data:topApplicants})
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong ")
    }
}

jobCltr.topjobs = async(req,res)=>{
    try {
        const topJobPosts = await JobApplication.aggregate([
            { $group: { _id: "$jobId", totalApplications: { $sum: 1 } } },
            { $sort: { totalApplications: -1 } },
            { $limit: 5 }
        ]);
        res.json({ success: true, data: topJobPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

jobCltr.subscriptionStatus = async(req,res)=>{
    try{
    //    const recruiterDetails = await Recruiter.find()
    //    console.log(recruiterDetails);
    //    const details = recruiterDetails.map((ele)=>ele.subscription)
       const subscriptionData = await Recruiter.aggregate([
        {
            $group:{
                _id:'$subscriptionPlan',
                count:{$sum:1}
            }
        }
       ])
       //console.log(subscriptionData)
       const formattedData = {
         free:0,
         basic:0,
         silver:0,
         gold:0
       }
       subscriptionData.forEach(item=>{
         formattedData[item._id] = item.count
       })
       res.json(formattedData)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.recentlyPosted = async(req,res)=>{
    try{
        const lastTen = await Job.find()
                      .sort({createdAt:-1})
                      .limit(10)
                      .lean()
        const jobIds = lastTen.map((ele)=>ele._id)
        const findingJob = await JobApplication.find({jobId:{$in:jobIds}})
        console.log(findingJob);
        return res.status(200).json({lastTen,findingJob})          
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

export default jobCltr