import mongoose, { Schema, model } from "mongoose";

const resumebuilderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    personalInfo: [{
        fullname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String },
        location:{type:String,required:true}
    }],
    education: [
        {
            degree: { type: String, required: true },
            institute: { type: String, required: true },
             startYear: { type: Number, required: true },
            endYear: { type: Number, required: true },
            cgpa: { type: String },
        },
    ],
    workExperience: [
        {
            jobtitle: { type: String, required: true },
            companyName: { type: String, required: true },
            startDate: { type: String, required: true },
            endDate: { type: String, required: true },
            experience :{type:String,required:true},
            description: { type: String },
        },
    ],
    skills: [
        {
            skillName: [{ type: String, required: true }],
            proficiency: { type: String, enum: ["Beginner", "Intermediate", "Expert"] },
        },
    ],
    certification: [
        {
            certificationName: { type: String, required: true },
            issuedBy: { type: String },
           issueDate: { type: String},
           expiryDate: { type: String },
        },
    ],
    project: [
        {
            projectName: { type: String },
            projectDescription: { type: String },
        },
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
    },
    visibility:{
      type:String,
      enum:["public","private","restricted"],
    },
    appliedJobs:[
      {
        type:mongoose.Types.ObjectId,
        ref:"JobApplication"
      }
    ]
});

const Resumebuilder = model("Resumebuilder", resumebuilderSchema);
export default Resumebuilder;
