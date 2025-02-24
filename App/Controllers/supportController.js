import Support from "../Models/supportmodel.js";
import Job from "../Models/jobmodel.js";
import Recruiter from "../Models/recruitermodel.js";

const supportCltr = {}

supportCltr.raisequery=async(req,res)=>{
    try{
        
       const {jobId,query} = req.body
       console.log("sdlkjf",jobId)
       const job = await Job.findById(jobId)
       if(!job){
        return res.status(400).json({error:"job not found"})
       }
       const recruiter = await Recruiter.findById(job.recruiterId).populate("userId")
       console.log(recruiter)
    //    const recruiter = await User.findById(recruiterId:job.)
    //    if(!recruiter){
    //     return res.status(400).json({error:"recruiter not found"})
    //    }
      const support = new Support ({
         candidateId:req.currentUser.userId,
         jobId,
         recruiterId:recruiter.userId._id,
         query
      })
      await support.save()
       //console.log(support)
       return res.status(201).json(support)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

supportCltr.recruiterqueries=async(req,res)=>{
    try{
       const queries = await Support.find({recruiterId:req.currentUser.userId})
                       .populate("jobId","jobtitle")
                       .populate("candidateId","name email")
                       //.sort({createdAt:-1})
        res.status(200).json(queries)         
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

supportCltr.replyquery = async(req,res)=>{
    try{
        const {id,response} = req.body
        const query = await Support.findById(id)
        if(!query){
            return res.status(400).json({error:"query id not found"})
        }
        query.response = response
        await query.save()
        res.status(200).json(query)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")  
    }
}

supportCltr.candidateresponse = async(req,res)=>{
    try{
        const {jobId} = req.params
       const queries = await Support.find({candidateId:req.currentUser.userId,jobId:jobId})
                             .populate("jobId", "title")
                             .populate("recruiterId", "name email")
                             console.log(queries)
              res.status(200).json(queries)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")  
    }
}


export default supportCltr