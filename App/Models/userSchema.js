import { Schema,model } from "mongoose";

const userSchema = new Schema ({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["recruiter","candidate"],
        required:true
    },
    //  companyname:{type:String,required:function(){ return this.role=="recruiter"}},
    // isverified:{type:Boolean,required:function(){return this.role=="recruiter"}},
    // verificationDocument:{type:String} 
},{timestamps:true})

const User = model("User",userSchema)

export default User