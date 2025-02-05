import {Schema,model} from "mongoose"

const jobapplicationSchema = new Schema({
    jobId:{
        type:Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    applicantId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
   videoUrl:{
       type:String
    }, 
    resumeUrl:{
        type:String,
        required:true
    },
    answeredQuestions: [{
        questionText: { type: String, required: true },
        startingTimestamp: { type: Number, required: true } // Correct field name should be 'startingTimestamp'
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