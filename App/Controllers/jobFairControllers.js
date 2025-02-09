import JobFair from "../Models/jobfairmodel.js";

import Recruiter from "../Models/recruitermodel.js";
import User from "../Models/userSchema.js";
const jobFairCltr = {}

jobFairCltr.createJobFair = async(req,res)=>{
    try{
        const {name,date,location,description} =req.body
        const newJobFair = new JobFair(req.body)
        await newJobFair.save()
        return res.status(201).json(newJobFair)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobFairCltr.recruiterDetails =async(req,res)=>{
    try{
        const {jobFairId,userId,role} = req.body
        console.log(req.body)
        const jobFair = await JobFair.findById(jobFairId)
        console.log(jobFair)
        if(!jobFair){
            return res.status(400).json({error:"jobfair not found"})
        }
        const jobData = await Recruiter.find({userId:userId})
        const value = jobData.map((ele)=>ele.companyname).join("")
        console.log(value)
        jobFair.recruiter.push({userId,companyname:value,role})
         await jobFair.save()
         res.status(200).json(jobFair)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong") 
    }
}

jobFairCltr.candidateDetails = async(req,res)=>{
    try{
       const {userId,jobFairId} = req.body
       const jobFair = await JobFair.findById(jobFairId)
       if(!jobFair){
         return res.status(400).json("jobfair not found")
       } 
       const user = await User.findById(userId)
       console.log(user)
       if(!user){
          return res.status(400).json("user not being found")
       }
       console.log(user.email)
       jobFair.candidates.push({userId,email:user.email})
       await jobFair.save()
       res.status(200).json(jobFair)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobFairCltr.getAlljobs=async(req,res)=>{
    try{
       console.log("hi") 
       const {jobFairId} = req.params
       console.log(jobFairId)
       const jobFair = await JobFair.findById(jobFairId)
       if(!jobFair){
        return res.status(400).json("jobfair not found")
       }
       console.log(jobFair.recruiter)
       res.json(jobFair.recruiter)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}


export default jobFairCltr