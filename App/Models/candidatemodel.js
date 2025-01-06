import { Schema, model } from 'mongoose';

const candidateSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model that stores user details
  },
  mobile: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => /^[6-9]\d{9}$/.test(v),
      message: 'Mobile number must be 10 digits and start with 6, 7, 8, or 9.',
    },
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
  resumeUpload: [
    {
      filename: { type: String, required: true },
      filepath: { type: String, required: true },
    },
  ], // Multer can be used for file uploads
  skills: [
    {
      skillName: String,
      experience: { type: Number, min: 1, max: 10 }, // Experience in years
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
