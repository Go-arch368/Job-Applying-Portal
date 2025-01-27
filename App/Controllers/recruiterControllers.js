import Recruiter from "../Models/recruitermodel.js";
import { validationResult } from "express-validator";
const recruiterCltr = {}
import User from "../Models/userSchema.js"

recruiterCltr.posting = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { companyname, location, website ,description } = req.body;

    try {
        const recruiter = new Recruiter({ companyname, location, website, userId: req.currentUser.userId ,description});
        const user = await User.findById(req.currentUser.userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
       // recruiter.name = user.name;
       // recruiter.email = user.email;
        await recruiter.save();
        const recruiterPopulate = await Recruiter.findById(recruiter._id).populate("userId");
        return res.status(201).json( recruiterPopulate );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

recruiterCltr.verify = async(req,res)=>{
    try{
        const getting = await Recruiter.find({isVerified:false})
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
    try{
        const findingId = await Recruiter.findById(id)
        if(!findingId){
            return res.status(404).json("your is not found")
        }
       const update = await Recruiter.findByIdAndUpdate(id,body,{new:true,runValidators:true})
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
        const findingId = await Recruiter.findById(id)
        if(!findingId){
            return res.status(404).json("your is not found")
        }
      
       const del =await Recruiter.findByIdAndDelete(id)
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

export default recruiterCltr