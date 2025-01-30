import {Schema,model} from "mongoose"

const jobposting = new Schema ({
    jobtitle:{
        type:String,required:true
    },
    companyname:{
        type:String,required:true
    },
    description:{
        type:String,required:true
    },
    recruiterId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Recruiter"
    },
    assignedQuestions:[{
        type:Schema.Types.ObjectId, ref:"Question"
    }],
    jobtype:{
        type:String,
        enum:["parttime","fulltime","freelance","internship"]
    },
    skillsrequired: { type: [String], required: true },
    location:{type:String,required:true},
    experienceRequired:{type:String},
    salary:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()},
    deadline:{type:String}
    
})

const Job = model ("Job",jobposting)

export default Job
