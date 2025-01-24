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
    console.log(questions)

    if(!Array.isArray(questions)&&questions.length==0){
        return res.status(400).json("Questions should not be empty")
    }
  
    try{
    const data = await Recruiter.findOne({userId:req.currentUser.userId})
    console.log(data._id)
    console.log(req.currentUser.userId)
    const newQuestion = new Question({
        questions,
        createdBy:data._id,
        jobId
    })
    const savedQuestion = await newQuestion.save()
    //console.log(data)
    const findingId = await Question.findById(savedQuestion._id)

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
    console.log(questions)
    console.log(jobId)

   if(!jobId){
    return res.status(400).json({error:"jobId is required"})
   }

    //console.log(jobId)
    if(!Array.isArray(questions)||questions.length==0){
        return res.status(400).json({error:"Question must not be an empty array"})
    }
    //console.log(req.currentUser.userId)
    const data = await Recruiter.findOne({userId:req.currentUser.userId})
    
    try{
      const updatedQuestions  = await Question.findOneAndUpdate(
        {jobId,createdBy:data._id},
        {questions},
        {new:true}
      )
      console.log(updatedQuestions)
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
      //console.log(jobId)
      const data = await Recruiter.findOne({userId:req.currentUser.userId})
      console.log(data)
     if(!data){
        return res.status(400).json("recruiter data is not being found")
     }
      const questions = await Question.findOne({jobId,createdBy:data._id}).populate("createdBy")
      console.log(questions)
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
            {$pull:{questions:{_id:questionId}}},//pull is used to delete from the given data.
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