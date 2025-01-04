
import User from "../Models/userSchema.js"

 export const  userValidations ={
    name:{
        exists:{
            errorMessage:"the name field is required"
        },
        notEmpty:{
            errorMessage:"the name field shoud not be empty"
        },
        isLength:{
            min:3,
            max:6,
            errorMessage:"the name field should atleast min of 3 and max of 6 characters"
        },
        trim:true
    },
    email:{
        exists:{
            errorMessage:"the email field is required"
        },
        notEmpty:{
            errorMessage:"the email should not be empty"
        },
        isEmail:{
            errorMessage:'the email should be in valid form'
        },
        custom:{
            options:async(email)=>{
                const user = await User.findOne({email:email})
                if(user){
                    throw new Error("the email already taken")
                }
                return true
            }
        },
        normalizeEmail:true,
        trim:true
    },
    password:{
        exists:{
            errorMessage:"the password field is required"
        },
        notEmpty:{
            errorMessage:"the password field is should not be empty"
        },
        isLength:{
            min:8,
            max:18,
            errorMessage:"the password field should contain atleast 8 of min and 18 max of length"
        },
        isStrongPassword:{
            options:{
                minLength:8,
                minUppercase:1,
                minLowercase:1,
                minSymbol:1,
                minNumber:1
            },
            errorMessage:"the password should contain atleast 8 characters min 1 upper 1 lower 1 symbol 1number"
        }
    }
}

export const loginValidation = {
    email:{
        exists:{
            errorMessage:"the email field is required"
        },
        notEmpty:{
            errorMessage:"the email should not be empty"
        },
        isEmail:{
            errorMessage:'the email should be in valid form'
        },
        normalizeEmail:true,
        trim:true
    },
    password:{
        exists:{
            errorMessage:"the password field is required"
        },
        notEmpty:{
            errorMessage:"the password field is should not be empty"
        },
        isLength:{
            min:8,
            max:18,
            errorMessage:"the password field should contain atleast 8 of min and 18 max of length"
        },
        isStrongPassword:{
            options:{
                minLength:8,
                minUppercase:1,
                minLowercase:1,
                minSymbol:1,
                minNumber:1
            },
            errorMessage:"the password should contain atleast 8 characters min 1 upper 1 lower 1 symbol 1number"
        } 
    }
}

