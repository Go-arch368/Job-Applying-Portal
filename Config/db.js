import mongoose from "mongoose";

const configuredb =async()=>{
    try{
        const db = mongoose.connect("mongodb://127.0.0.1:27017/jobApplyingPortal")
        console.log("Your database is running successfully")
    }
    catch(err){
        console.log(err)
    }
}

export default configuredb