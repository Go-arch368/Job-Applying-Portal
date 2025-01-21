import Question from "../Models/questionmodel.js"
const questionCltr = {}
import { validationResult } from "express-validator"
import Recruiter from "../Models/recruitermodel.js"


questionCltr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const {questions,jobId} =req.body

    if(!Array.isArray(questions)&&questions.length==0){
        return res.status(400).json("Questions should not be empty")
    }
  
    try{
        const data = await Recruiter.findOne({userId:req.currentUser.userId})
    const newQuestion = new Question({
        questions,
        createdBy:data,
        jobId
    })
    const savedQuestion = await newQuestion.save()
   
    
  
    console.log(data)
    const findingId = await Question.findById(savedQuestion._id).populate("createdBy")

    return res.status(201).json(findingId)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({err:"internal server error"})
    }
}

questionCltr.update = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(500).json({error:errors.array()})
    }
    const {questions} = req.body
    const {jobId} = req.params

   if(!jobId){
    return res.status(400).json({error:"jobId is required"})
   }

    //console.log(jobId)
    if(!Array.isArray(questions)||questions.length==0){
        return res.status(400).json({error:"Question must not be an empty array"})
    }
    try{
      const updatedQuestions  = await Question.findOneAndUpdate(
        {jobId,createdBy:req.currentUser.userId},
        {questions},
        {new:true}
      )
      if(!updatedQuestions) {
        return res.status(404).json("questions not found or unauthorized to update")
      }
      return res.status(200).json(updatedQuestions)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("internal server error")
    }
}

questionCltr.getById = async(req,res)=>{
    try{
      const jobId = req.params.jobId
      const data = await Recruiter.findOne({userId:req.currentUser.userId})
     if(!data){
        return res.status(400).json("recruiter data is not being found")
     }
      const questions = await Question.findOne({jobId,createdBy:data._id}).populate("createdBy")
      if(!questions){
        return res.status(404).json("question not found for this job")
      }
      return res.status(200).json(questions)
    }
    catch(err){
        console.log(err)
        return res.json(500).json("internal server error")
    }
}

questionCltr.deletewithJob=async(req,res)=>{
    try{
        const {jobId,questionId} =req.params
        const updatedQuestion = await Question.findOneAndUpdate({jobId,"questions._id":questionId},
            {$pull:{questions:{_id:questionId}}},
            {new:true}
        )
        if (!updatedQuestion) {
            return res.status(404).json({ error: "Question not found for this job" });
        }

        return res.status(200).json(updatedQuestion);
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

export default questionCltr