const resumebuilder = {
    personalInfo: {
        exists: {
            errorMessage: "the personalInfo field is required"
        },
        notEmpty: {
            errorMessage: "the personalInfo field should not be empty"
        },
        isArray: {
            errorMessage: "the personalInfo field should be an array"
        },
        custom: {
            options: (value) => Array.isArray(value) && value.every(item => item.fullname && item.email && item.phone)
        }
    },
    education: {
        exists: {
            errorMessage: "the education field is required"
        },
        notEmpty: {
            errorMessage: "the education field should not be empty"
        },
        isArray: {
            errorMessage: "the education should be in the array format of details"
        },
        custom: {
            options: (value) => Array.isArray(value) && value.every(item => item.degree && item.institute && item.startYear && item.endYear && item.cgpa),
            errorMessage: "the education should contain degree, institute, startYear, endYear, and cgpa"
        }
    },
    workExperience: {
        exists: {
            errorMessage: "the workExperience field is required"
        },
        notEmpty: {
            errorMessage: "the workExperience field should not be empty"
        },
        isArray: {
            errorMessage: "the workExperience should be in the array format of details"
        },
        custom: {
            options: (value) => Array.isArray(value) && value.every(item => item.jobtitle && item.companyName && item.description),
            errorMessage: "the work experience should contain jobtitle, companyName, and description"
        }
    },
    skills: {
        exists: {
            errorMessage: "the skill field is required"
        },
        notEmpty: {
            errorMessage: "the skill field should not be empty"
        },
        isArray: {
            errorMessage: "the skills should be in the array format"
        },
        custom: {
            options: (value) => Array.isArray(value) && value.every(item => item.skillName && item.proficiency),
            errorMessage: "the skill field should contain skillName and proficiency"
        }
    },
    certification: {
        exists: {
            errorMessage: "the certification field is required"
        },
        notEmpty: {
            errorMessage: "the certification field should not be empty"
        },
        isArray: {
            errorMessage: "the certification should be in the array format of details"
        },
        custom: {
            options: (value) => Array.isArray(value) && value.every(item => item.certificationName && item.issuedBy && item.issueDate && item.expiryDate),
            errorMessage: "the certification should contain certification name, issued date, and expiry date"
        }
    },
    project: {
        exists: {
            errorMessage: "the project field is required"
        },
        notEmpty: {
            errorMessage: "the project field should not be empty"
        },
        isArray: {
            errorMessage: "the project should be in the array format of details"
        },
        custom: {
            options: (value) => Array.isArray(value) && value.every(item => item.projectName && item.projectDescription),
            errorMessage: "the project should contain project name and description"
        }
    }
};

export default resumebuilder;
