const recruiterValidator = {
    companyname:{
        exists:{
            errorMessage:"the company name field is required"
        },
        notEmpty:{
            errorMessage:"the company name should not be empty"
        },
        trim:true
    },
    location:{
        exists:{
            errorMessage:"the location name field is required"
        },
        notEmpty:{
            errorMessage:"the location name should not be empty"
        },
        trim:true  
    },
    website:{
        exists:{
            errorMessage:"the website name field is required"
        },
        notEmpty:{
            errorMessage:"the website name should not be empty"
        },
        trim:true  
    }
}

export default recruiterValidator