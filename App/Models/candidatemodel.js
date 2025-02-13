import { Schema, model } from 'mongoose';

const candidateSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
  },
  profilePicture:{type:String},
  mobile: {
    type: Number,
  },
  education: [
    {
      degree: { type: String, required: true },
      startyear: { type: Number, required: true },
      endyear: { type: Number, required: true },
      institute: { type: String, required: true },
      cgpa: { type: Number },
    },
  ],
  resumeUpload:{
    type:String,
    required:true
},
  skills: [
    {
      skillName: String,
      experience: { type: Number, min: 1, max: 10 }, 
    },
  ],
  certification: [
    {
      certificationName: { type: String, required: true },
      duration: {
        startMonth: { type: String },
        endMonth: { type: String },
      },
    },
  ],
   saveJobs: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Job' 
  }]
});

const Candidate = model('Candidate', candidateSchema);

export default Candidate;
