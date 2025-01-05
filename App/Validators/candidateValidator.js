const candidateValidator= {
    mobile:{
        exists:{
            errorMessage:"the mobile field should not be empty"
        },
        notEmpty:{
           errorMessage:"the mobile field should not be empty"   
        },
        isLength:{
           options:{
            min:10,
            max:12
           },
           errorMessage:"the length field should contain atleast 10 char to 12 char"
        },
    },
    education:{
        exists:{
            errorMessage:"the mobile field should not be empty"
        },
        notEmpty:{
           errorMessage:"the mobile field should not be empty"   
        },
        trim:true
    },
    resumeUpload:{
        exists:{
            errorMessage:"the mobile field should not be empty"
        },
        notEmpty:{
           errorMessage:"the mobile field should not be empty"   
        }, 
    },
    skills:{
        exists:{
            errorMessage:"the mobile field should not be empty"
        },
        notEmpty:{
           errorMessage:"the mobile field should not be empty"   
        }, 
        trim:true  
    },
    certification:{
        exists:{
            errorMessage:"the mobile field should not be empty"
        },
        notEmpty:{
           errorMessage:"the mobile field should not be empty"   
        }, 
        trim:true  
    }
}

export default candidateValidator