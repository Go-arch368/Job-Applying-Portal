import mongoose from "mongoose";

const configuredb =async()=>{
    try{
            const db = await mongoose.connect(
            `mongodb+srv://gowthamtj0808_db_user:${process.env.DB_PASSWORD}@cluster0.vibqbu6.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0`
        );
        console.log("Your database is running successfully")
    }
    catch(err){
        console.log(err)
    }
}

export default configuredb