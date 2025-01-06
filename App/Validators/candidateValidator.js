const candidateValidator = {
    mobile: {
      exists: {
        errorMessage: "The mobile field should not be empty",
      },
      notEmpty: {
        errorMessage: "The mobile field should not be empty",
      },
      isLength: {
        options: { min: 10, max: 12 },
        errorMessage: "The mobile field should contain between 10 to 12 characters",
      },
      isNumeric: {
        errorMessage: "The mobile field should only contain numbers",
      },
    },
    education: {
      exists: {
        errorMessage: "The education field should not be empty",
      },
      notEmpty: {
        errorMessage: "The education field should not be empty",
      },
      /* isArray: {
        errorMessage: "The education field should be an array of education details",
      }, */
    /*   custom: {
        options: (value) => {
          // You could add further validation here if `education` needs a specific structure
          return Array.isArray(value) && value.every(item => item.degree && item.startyear && item.endyear);
        },
        errorMessage: "Each education item must have a degree, startyear, and endyear",
      }, */
    },
    skills: {
      exists: {
        errorMessage: "The skills field should not be empty",
      },
      notEmpty: {
        errorMessage: "The skills field should not be empty",
      },
    /*   isArray: {
        errorMessage: "The skills field should be an array of skills",
      }, */
    /*   custom: {
        options: (value) => {
          // You can add further validation if needed, e.g., checking if each skill has a name and experience
          return Array.isArray(value) && value.every(item => item.skillName && item.experience);
        },
        errorMessage: "Each skill item must have skillName and experience",
      }, */
    },
    certification: {
      exists: {
        errorMessage: "The certification field should not be empty",
      },
      notEmpty: {
        errorMessage: "The certification field should not be empty",
      },
   /*    isArray: {
        errorMessage: "The certification field should be an array of certifications",
      }, */
 /*      custom: {
        options: (value) => {
          // Further validation can be added here if certification items need specific structure
          return Array.isArray(value) && value.every(item => item.certificationName && item.duration);
        },
        errorMessage: "Each certification item must have certificationName and duration",
      }, */
    },
  };
  
  export default candidateValidator;
  