import {Schema,model} from "mongoose"

const interviewSchema = new Schema({
    jobId:{type:Schema.Types.ObjectId,ref:"Job",required:true},
    applicants :[{type:Schema.Types.ObjectId,ref:"Candidate",required:true}],
    date:{type:String,required:true},
    time:{type:String,required:true},
    location:{type:String,required:true},
    mode:{type:String,enum:["Online","Offline"],required:true}
})

const Interview = model("Interview",interviewSchema)

export default Interview