import User from "../Models/userSchema.js"
import { validationResult } from "express-validator"
const userCltr = {}
import Recruiter from "../Models/recruitermodel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cloudinary from "../../Config/cloudinary.js"


userCltr.register=async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({error:errors.array()})
    }
    const body = req.body
    try{
        const user = new User(body)
        const salt = await bcrypt.genSalt()
        const hash= await bcrypt.hash(user.password,salt)
           user.password=hash
        const userdetails =await User.countDocuments()
        if(userdetails==0){
          user.role="admin"
        }
        await user.save()
        const tokenData = jwt.sign({userId:user._id,role:user.role},"Secret@123",{expiresIn:"7d"})
      return res.json({token:tokenData})
    }
    catch(err){
      console.log(err)
      res.status(500).json({error:err})
    }
}

userCltr.loginUser=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({error:errors.array()})
    }
    const body = req.body
    try{
      const user = await User.findOne({email:body.email})
      if(!user){
        return res.status(404).json({error:"invalid username or password"})
      }
      const isValid = await bcrypt.compare(body.password,user.password)
      if(!isValid){
        return res.status(404).json({error:"invalid username or password"})
      }
      const userCount = await User.countDocuments()
      if(userCount>1&&user.role==="recruiter"){
           const recruiter = await Recruiter.findOne({userId:user._id})
           if(!recruiter){
             return res.status(404).json({error:"recriter details not being found"})
           }
           if(!recruiter.isVerified){
            return res.status(403).json({error:"Your data is not verified by the admin"})
           }
      }

    const tokenData = jwt.sign({userId:user._id,role:user.role},"Secret@123",{expiresIn:"7d"})
      return res.json({token:tokenData,user})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:err})
    }
}

userCltr.getUserData=async(req,res)=>{
    try{
      const user = await User.findById(req.currentUser.userId)
      return res.json(user)
    }
    catch(err){
        console.log(err)
    }
}




userCltr.postDetails = async (req, res) => {
  try {
    console.log("hi");

    // Check if currentUser exists
    if (!req.currentUser || !req.currentUser.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { mobile, responsibilities } = req.body;
    console.log("Mobile:", mobile);
    console.log("File:", req.file);
    console.log("Responsibilities:", responsibilities);

    const userId = req.currentUser.userId;
    let updateData = {}; 

  
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
        width: 300,
        height: 300,
        crop: "fill",
      });
      console.log("Uploaded Image URL:", result.secure_url);
      updateData.profile = result.secure_url; 
    }

 
    if (mobile) {
      if (typeof mobile === "string") {
        try {
          updateData.mobile = JSON.parse(mobile);
        } catch (error) {
          return res.status(400).json({ error: "Invalid mobile format" });
        }
      } else {
        updateData.mobile = mobile;
      }
    }

    if (responsibilities) {
      if (typeof responsibilities === "string") {
        try {
          updateData.responsibilities = JSON.parse(responsibilities);
        } catch (error) {
          return res.status(400).json({ error: "Invalid responsibilities format" });
        }
      } else {
        updateData.responsibilities = responsibilities;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No data provided for update" });
    }

    const userDetails = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(userDetails);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


/* userCltr.verify=async(req,res)=>{
    try{
     const getVerified = await User.find({isverified:false})
     return  res.json(getVerified)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({err:"something went wrong"})
    }
}

userCltr.updateRecruiter = async(req,res)=>{
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({error:errors.array()})
    }
       const id = req.params.id
       const body= req.body
    try{
        const checkId = await User.findById(id)
        if(!checkId){
            return res.status(404).json("your id is not found")
        }
      const update = await User.findByIdAndUpdate(id,body,{new:true,runValidators:true})
      return res.status(200).json(update)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({err:"something went wrong"})
    }
}

userCltr.getAll = async(req,res)=>{
    try{
      const userDetails = await User.find({isverified:true})
      return res.json(userDetails)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({err:"something went wrong"})
    }
} */

export default userCltr