import mongoose,{model,Schema} from "mongoose"

const supportSchema = new Schema({
    jobId:{
        type:Schema.Types.ObjectId,ref:"Job"
    },
    candidateId:{
        type:Schema.Types.ObjectId,ref:"User"
    },
    recruiterId:{
        type:Schema.Types.ObjectId,ref:"User"
    },
    query:{
        type:String
    } ,
    response:{type:String},
    
},{timestamps:true})


const Support = model("Support",supportSchema)

export default Support 