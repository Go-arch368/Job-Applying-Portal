import mongoose,{Schema,model} from "mongoose"

const jobFairSchema = new Schema({
    name:{type:String,required:true},
    date:{type:Date,required:true},
    location:{type:String,required:true},
    model:{type:String,enum:["Virtual","Offline"]},
    description:{type:String},
    status:{type:String,enum:["Upcoming","Ongoing","Completed"],default:"Upcoming"},
    recruiter:[{
        userId:{type:Schema.Types.ObjectId,ref:"Recruiter"},
        companyname:String,
        role:String
    }],
    candidates:[{
        userId:{type:Schema.Types.ObjectId,ref:"Candidate"},
        email:String
    }],
    jobs:[
        {type:mongoose.Schema.ObjectId,ref:"Job"}
    ],
    jobApply:{type:String,enum:[true,false]}
})

const JobFair = model("JobFair",jobFairSchema)

export default JobFair