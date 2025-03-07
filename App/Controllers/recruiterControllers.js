import Recruiter from "../Models/recruitermodel.js";
import { validationResult } from "express-validator";
const recruiterCltr = {}
import User from "../Models/userSchema.js"
import cloudinary from "../../Config/cloudinary.js";
import JobApplication from "../Models/jobapplicationmodel.js";
import Job from "../Models/jobmodel.js";
import nodemailer from "nodemailer"
import sendEmail from "../../Config/emailService.js";


recruiterCltr.posting = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { companyname, location, website ,description } = req.body;

    try {
        const recruiter = new Recruiter({ companyname, location, website, userId: req.currentUser.userId ,description});
        const user = await User.findById(req.currentUser.userId);
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
       // recruiter.name = user.name;
       // recruiter.email = user.email;
        await recruiter.save();
        const recruiterPopulate = await Recruiter.findById(recruiter._id).populate("userId");
       
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.APP_PASSWORD
            }
        })

        const mailOptions = {
            from:process.env.EMAIL,
            to:process.env.EMAIL,
            subject: "🚀 New Recruiter Registered",
            text:`A New recruiter has been reigstered ${user.name} (${user.email}).
                 Company:${companyname}, Location:${location},Website:${website}`
        }
        await transporter.sendMail(mailOptions)

        return res.status(201).json( recruiterPopulate );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

recruiterCltr.verify = async(req,res)=>{
    try{
        const getting = await Recruiter.find({isVerified:false}).populate("userId")
        return res.json(getting)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

recruiterCltr.update = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    } 
        const id = req.params.id
        const body = req.body
        console.log("hello",body)
    try{
        const findingId = await Recruiter.findById(id).populate('userId')
        console.log(findingId)
        if(!findingId){
            return res.status(404).json("your is not found")
        }
       const update = await Recruiter.findByIdAndUpdate(id,body,{new:true,runValidators:true}).populate("userId")
       await sendEmail(
        findingId.userId.email,
        "🎉 Congratulations! You’ve been selected as a recruiter",
        `We’re excited to let you know that ${findingId.companyname} has selected you. You can now start posting jobs on our platform. Best of luck! 🚀`
       );    
       return res.status(200).json(update)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong") 
    }
}

recruiterCltr.destroy=async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    } 
        const id = req.params.id
   
    try{
        const findingId = await Recruiter.findById(id).populate("userId")
        if(!findingId){
            return res.status(404).json("your is not found")
        }
      
       const del =await Recruiter.findByIdAndDelete(id).populate("userId")

       await sendEmail(
        findingId.userId.email,
        "🔔 Update on Your Recruiter Status",
        `We regret to inform you that your recruiter access with ${findingId.companyname} has been removed. If you believe this is an error or have any questions, please reach out to our support team.`
       );
    
       return res.status(200).json(del)

    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong") 
    }
}

recruiterCltr.getbyId=async(req,res)=>{
    try{
        const id = req.params.id
       const getData = await Recruiter.findById(id)
       return res.json(getData)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

recruiterCltr.createRecruiter = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "profile_pictures",
            width: 300,
            height: 300,
            crop: "fill"
        });
       
        // const applicant = await Job.find({ recruiterId: req.currentUser.userId });
        // console.log(applicant)
        const recruiter = await Recruiter.findOne({ userId: req.currentUser.userId });

        if (!recruiter) {
            return res.status(404).json({ error: "Recruiter profile not found for this user" });
        }

        // recruiter.role = role;
        recruiter.companyLogo = result?.secure_url || recruiter.companyLogo;
        // recruiter.jobPosted = applicant

        await recruiter.save();
        return res.status(200).json( recruiter);

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

recruiterCltr.getRecruiterById = async(req,res)=>{
     try{
         const {id} = req.params
         const recruiter = await Recruiter.findOne({userId:id}).populate("userId")
         console.log(recruiter);
         
         const applicant = await Job.find({ recruiterId: req.currentUser.userId });
         recruiter.jobPosted=applicant
         if(!recruiter){
            return res.status(400).json({error:'recruiter not found'})
         }
         res.status(200).json(recruiter)
     }
     catch(err){
        console.log(err)
        return res.status(500).json("someting went wrong")
     }
}

recruiterCltr.updateData = async (req, res) => {
    try {
        const { id } = req.params; 
        const updates = req.body
        
        // if (typeof updates === "string") {
        //     updates = JSON.parse(updates); // Convert from string to object if needed
        // }

        const recruiter = await Recruiter.findOne({ userId: id });
        if (!recruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }

      
        Object.keys(updates).forEach((key) => {
            recruiter[key] = updates[key];
        });

        // Handle file upload if exists
        // if (req.file) {
        //     const result = await cloudinary.uploader.upload(req.file.path, {
        //         folder: "profile_pictures",
        //         width: 300,
        //         height: 300,
        //         crop: "fill"
        //     });
        //     recruiter.companyLogo = result?.secure_url || recruiter.companyLogo;
        // }

        await recruiter.save();

        return res.status(200).json({ message: "Profile updated successfully", recruiter });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

recruiterCltr.upgradeSubscription = async(req,res) =>{
    try{
       const userId = req.currentUser.userId
       const {plan} = req.body
       const planDetails={
          basic:{duration:30,canViewStats:false,topOnSearch:false},
          silver:{duration:90,canViewStats:false,topOnSearch:true},
          gold:{duration:180,canViewStats:true,topOnSearch:true}
       }
       if(!planDetails[plan]){
         return res.status(400).json({error:"Invalid subscription plan"})
       }
       const subscriptionExpiry = new Date()
       subscriptionExpiry.setDate(subscriptionExpiry.getDate()+planDetails[plan].duration)
    const updateRecruiter =  await Recruiter.findOneAndUpdate({userId},{
        isSubscribed:true,
        subscriptionPlan:plan,
        subscriptionExpiry,
        jobPostingLimit:Infinity,
        canViewStats:planDetails[plan].canViewStats,
        topOnSearch:planDetails[plan].topOnSearch
       },
    )
     res.status(200).json(updateRecruiter)
    }
    catch(err){
      console.log(err)
      return res.status(500).json("something went wrong")
    }
}

recruiterCltr.getRecruiterDetails = async(req,res)=>{
    try{
        console.log("hi");
        
      console.log(req.currentUser.userId)
      const recruiter = await Recruiter.findOne({userId:req.currentUser.userId})
      if(!recruiter){
        return res.status(400).json({error:"recruiter not found"})
      }
      return res.status(200).json(recruiter)
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong ")
    }
}


export default recruiterCltr