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

    if(!Array.isArray(questions)||questions.length==0){
        return res.status(400).json("Questions should not be empty")
    }
  
    try{
    const data = await Recruiter.findOne({userId:req.currentUser.userId})
    if(!data){
        return res.status(404).json({error:"recruiter not found"})
    }
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

questionCltr.update = async (req, res) => {
    try {
       const {questionsId} = req.params
       const {updatedQuestionText} = req.body
       const question = await  Question.findOneAndUpdate(
        { "questions._id": questionsId },
        {
            $set: {
                "questions.$.questionText": updatedQuestionText  
            }
        },
        { new: true, runValidators: true }  )
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }
        res.json({
            message: "Question updated successfully",
            question
        });
    
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


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

questionCltr.deleteWithJob = async (req, res) => {
    try {
        const { questionsId } = req.params;  
        const question = await Question.findOneAndUpdate(
            { "questions._id": questionsId }, 
            { $pull: { questions: { _id: questionsId } } },  
            { new: true }  
        );
         console.log(question)
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        res.json({
            message: "Question deleted successfully",
            question
        });

    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export default questionCltr