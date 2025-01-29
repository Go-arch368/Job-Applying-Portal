import {Schema,model} from "mongoose"

const recruiter = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    companyname:String,
    location:String,
    website:String,
    isVerified:{
        type:Boolean, default:false,
    },
    name:String,
    /*  email:String, */
    description:String
},{timestamps:true})

const Recruiter = model("Recruiter",recruiter)

export default Recruiter    