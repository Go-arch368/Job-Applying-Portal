import jwt from "jsonwebtoken"

export default function authenticateUser(req,res,next){
      const tokenVerify = req.headers["authorization"]
       if(!tokenVerify){
        return res.status(400).json("invalid token")
      } 
      try{
        const tokenDetails = jwt.verify(tokenVerify,process.env.SECRET_KEY)
        req.currentUser = {
            userId:tokenDetails.userId,
            role:tokenDetails.role
        }
       // console.log(req.currentUser.userId)
        next()
      }
      catch(err){
        console.log(err)
        return res.status(500).json({error:"invalid or expired token"})
      }
}

