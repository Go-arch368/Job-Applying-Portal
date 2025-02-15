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
    description:String,
    role:{type:[String]},
    companyLogo:{type:String},
    jobPosted:[{type:Schema.Types.ObjectId,ref:"Job"}],
    jobPostingLimit:{type:Number,default:5},
    totalJobPosts:{type:Number,default:0},
    isSubscribed:{type:Boolean,default:false},
    subscriptionPlan:{type:String,enum:["free","basic","silver","gold"]},
    subscriptionExpiry:{type:Date}
},{timestamps:true})

const Recruiter = model("Recruiter",recruiter)

export default Recruiter    