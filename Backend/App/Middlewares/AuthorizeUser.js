export default function authorizeUser(permittedRoles){
    return (req,res,next)=>{
        try{
           if(permittedRoles.includes(req.currentUser.role)){
             next()
           } else {
             return res.status(403).json({error:'You are not authorized to access this resource'})
           }
        }
        catch(err){
            console.log(err)
            return res.status(500).json({err:'something went wrong'})
        }
    }
}