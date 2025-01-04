export default function authorizeUser(permittedRoles){
    return (req,res,next)=>{
        try{
           if(permittedRoles.includes(req.currentUser.role)){
             next()
           }
        }
        catch(err){
            console.log(err)
            return res.status(500).json({err:'something went wrong'})
        }
    }
}