
const jobValidators = {
    title:{
        exists:{
            errorMessage:"the jobtitle field is required"
        },
        notEmpty:{
            errorMessage:'the jobtitle field should not be empty'
        },
        trim:true
    },
    description:{
        exists:{
            errorMessage:"the description field is required"
        },
        notEmpty:{
            errorMessage:"the description field should not be empty"
        },
        trim:true
    },
    location:{
        exists:{
            errorMessage:"the location field is required"
        },
        notEmpty:{
            errorMessage:"the locaiton field should not be empty"
        },
        trim:true
    },
    salaryRange:{
        exists:{
            errorMessage:"the salary field is required"
        },
        notEmpty:{
            errorMessage:"the salary field should not be empty"
        },
        trim:true 
    }
}

export default jobValidators