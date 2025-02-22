import User from "../Models/userSchema.js"
const userpassCltr = {}
import bcryptjs from "bcryptjs"

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/; // Minimum 8 characters, 1 uppercase, 1 number, 1 special character
    return passwordRegex.test(password);
};

userpassCltr.resetPassword=async (req,res)=>{
    try{
        const {email,oldPassword,newPassword} = req.body
        console.log(email,oldPassword,newPassword)
        if(!email||!oldPassword||!newPassword){
            return res.status(400).json({error:"all fields are required"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({error:"User with this details doesn't exist"})
        }
        if(!validatePassword(newPassword)){
            return res.status(400).json({
                error:
                  "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.",
              });
        }

            const compatePassword = await bcryptjs.compare(oldPassword,user.password)
            if(!compatePassword){
                return res.status(400).json({error:"incorrect old password"})
            }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword,salt)

        user.password = hashedPassword


        // if (!(await comparePassword(oldPassword, user.password))) {
        //     return res.status(400).json({ error: "Incorrect old password." });
        //   }
         
        //   user.password = await hashPassword(newPassword)
          await user.save()
          return res.status(200).json({message:"password has been updated successfully"})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"something went wrong"})
    }
}

export default userpassCltr