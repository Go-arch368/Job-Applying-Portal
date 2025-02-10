import Candidate from "../Models/candidatemodel.js";
import JobFair from "../Models/jobfairmodel.js";

import Recruiter from "../Models/recruitermodel.js";
import User from "../Models/userSchema.js";
const jobFairCltr = {}

jobFairCltr.createJobFair = async(req,res)=>{
    try{
        const {name,date,location,description} =req.body
        const newJobFair = new JobFair({name,date,location,description})
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
        const {jobFairId,role} = req.body
        console.log(req.body)
        const jobFair = await JobFair.findById(jobFairId)
        console.log(jobFair)
        if(!jobFair){
            return res.status(400).json({error:"jobfair not found"})
        }
        const jobData = await Recruiter.find({userId:req.currentUser.userId})
        const value = jobData.map((ele)=>ele.companyname).join("")
        console.log(value)
        jobFair.recruiter.push({userId:jobData.userId,companyname:value,role})
         await jobFair.save()
         res.status(200).json({message:"successfully created",jobFair})
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong") 
    }
}

jobFairCltr.candidateDetails = async(req,res)=>{
    try{
       const {jobFairId} = req.body
       const jobFair = await JobFair.findById(jobFairId)
       if(!jobFair){
         return res.status(400).json("jobfair not found")    
       } 
       const user = await User.findById(req.currentUser.userId)
       console.log(user)
       if(!user){
          return res.status(400).json("user not being found")
       }

      const existingUser = jobFair.candidates.some((ele)=>ele.userId.toString()===user._id.toString())
      
      if(existingUser){
         return res.status(400).json({error:"you have already applied for this job"})
      }
      
       console.log(user.email)
       jobFair.jobApply=true
       jobFair.candidates.push({userId:user._id,email:user.email})
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

jobFairCltr.getAllJobFair = async(req,res)=>{
    try{
       const jobFair = await JobFair.find()
       if(jobFair.length==0){
         return res.status(400).json({error:"no jobfair is being found"})
       }
       res.status(200).json(jobFair)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobFairCltr.updateJobFair=async(req,res)=>{
    try{
      const {jobFairId} = req.params
      const body = req.body
      const updatingJobFair = await JobFair.findByIdAndUpdate(jobFairId,body,{new:true,runValidators:true})
      if(!updatingJobFair){
        return res.status(400).json({error:"your selected jobFair is not being found"})
      }
      res.status(200).json(updatingJobFair)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobFairCltr.deleteJobFair=async(req,res)=>{
    try{
       const {jobFairId} = req.params
       const deleteJobFair = await JobFair.findByIdAndDelete(jobFairId)
       if(!deleteJobFair){
        return res.status(400).json({error:"deleteJobFair id is not found"})
       }
       res.status(200).json(deleteJobFair)
    }
    catch(err){
        console.log(err)
        return res.status(200).json("something went wrong")
    }
}


export default jobFairCltr