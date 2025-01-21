import {Schema,model} from "mongoose"

const jobposting = new Schema ({
    title:{
        type:String,required:true
    },
    description:{
        type:String,required:true
    },
    recruiterId:{
        type:Schema.Types.ObjectId,required:true,
        ref:"Recruiter"
    },
    assignedQuestions:[{
        type:Schema.Types.ObjectId, ref:"Question"
    }],
    jobtype:{
        type:String,
        enum:["parttime","fulltime","freelance","internship"]
    },
    location:{type:String,required:true},
    experienceRequired:{type:String,required:true},
    salaryRange:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()},
    deadline:"String"
    
})

const Job = model ("Job",jobposting)

export default Job
