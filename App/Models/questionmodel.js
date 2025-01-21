import { Schema, model } from "mongoose";

const questionSchema = new Schema({
  questions: [
    {
      text: { type: String, required: true },
      type: { type: String, enum: ["video"], required: true },
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = model("Question", questionSchema);

export default Question;
