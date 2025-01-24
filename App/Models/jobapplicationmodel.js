import {Schema,model} from "mongoose"

const jobapplicationSchema = new Schema({
    jobId:{
        type:Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    applicantId:{
        type:Schema.Types.ObjectId,
        ref:"Candidate",
        required:true
    },
   videoUrl:{
       type:String,
       required:true
    }, 
    resumeUrl:{
        type:String,
        required:true
    },
    answeredQuestions:[{
        questionId:{
           type:String,requried:true
        },
        questionText:{
            type:String,requried:true
        }
    }],
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
},{timestamps:true})

const JobApplication = model("JobApplication",jobapplicationSchema)
export default JobApplication