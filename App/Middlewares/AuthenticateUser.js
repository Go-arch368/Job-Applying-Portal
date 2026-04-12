import jwt from "jsonwebtoken"

export default function authenticateUser(req,res,next){
      const tokenVerify = req.headers["authorization"]
       if(!tokenVerify){
        return res.status(401).json({error:"No token provided"})
      } 
      try{
        const tokenDetails = jwt.verify(tokenVerify,process.env.SECRET_KEY)
        req.currentUser = {
            userId:tokenDetails.userId,
            role:tokenDetails.role
        }
       console.log(req.currentUser.userId)
        next()
      }
      catch(err){
        console.log(err)
        return res.status(401).json({error:"Invalid or expired token"})
      }
}

