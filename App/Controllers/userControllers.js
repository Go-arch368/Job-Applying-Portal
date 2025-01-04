import User from "../Models/userSchema.js"
import { validationResult } from "express-validator"
const userCltr = {}
import bcrypt from "bcryptjs"

userCltr.register=async(req,res)=>{
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({error:errors.array()})
    }
    const {name,email,password,role,companyname,isverified}= req.body;

    try{
      const userDetails = await User.countDocuments()
      if(userDetails>1){
        if(role==="recruiter"&&!companyname){
            return res.status(400).json({message:"company name field is required"})
          }
      }
      let assignedRole = role;
      if(userDetails==0){
        if(role=="recruiter"){
            assignedRole="admin"
            
        }else{
            assignedRole="admin"
            
        }
      }
       const user = new User({name,
        email,
        password,
        role:assignedRole,
        companyname:role=="recruiter"?companyname:undefined,
        isverified:role=="recruiter"?(userDetails==0?true:false):true})
       const salt = await bcrypt.genSalt()
       const hash = await bcrypt.hash(user.password,salt)
       user.password = hash
       
       await user.save()
       return res.status(201).json(user)

    }
    catch(err){
      console.log(err)
      return res.status(500).json({err:"something went wrong"})
    }
}

userCltr.login=async(req,res)=>{
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({error:errors.array()})
    }
    const {email,password} = req.body
    try{
      const user = await User.findOne({email:email})
      if(user.isverified===false){
          return res.status(404).json("your account is still not verified by the admin")
      }
      if(!user){
         return res.status(404).json("invalid email or password")
      }
      const isValid = await animation bcrypt.compare(password,user.password)
      if(!isValid){
        return res.status(404).json("invalid email or password")
      }
      const tokenData = {userId:user._id,role:user.role}
      const token = jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:"7d"})
      return res.json(token)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({err:"something went wrong"})
    }
}

export default userCltr