const questionValidation = {
    text:{
        exists:{
            errorMessage:"the text field is required"
        },
        notEmpty:{
            errorMessage:"the text field should not be empty,"
        },
        trim:true
    },
    /* type:{
        exists:{
            errorMessage:"the video field is required"
        },
        notEmpty:{
            errorMessage:"the video field should not be empty,"
        },
        trim:true
    } */
}

export default questionValidation