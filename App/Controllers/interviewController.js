import User from "../Models/userSchema.js";
import nodemailer from "nodemailer"
import Interview from "../Models/interviewmodel.js";
import JobApplication from "../Models/jobapplicationmodel.js";
import Job from "../Models/jobmodel.js";

const interviewCltr={}




interviewCltr.scheduleInterview = async (req, res) => {
  try {
    const { jobId, date, time, location, mode ,applicants} = req.body;
    console.log(jobId,time,date,location,mode)
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    console.log("Job found:", job);

    const jobApplicants = await JobApplication.find({ jobId, status: "accepted" });
    if (jobApplicants.length === 0) {
      return res.status(400).json({ error: "No accepted applicants found" });
    }


    
    const applicantIds = jobApplicants.map((ele)=>ele.applicantId)
    if(applicantIds.length==0){
        return res.status(400).json({ error: "No valid applicant IDs found" });
    }
   
    const newInterview = new Interview({
        jobId,
        applicants:applicantIds,
        date,
        time,
        location,
        mode
    })
    await newInterview.save()

    

    const applicantData = await User.find({ _id: { $in: applicantIds } },"email" );
    console.log(applicantData)
    const applicantEmails = applicantData.map((ele) => ele.email);

    //return res.status(200).json({ message: "Interview scheduled successfully", emails: applicantEmails });

    const transporter =nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.APP_PASSWORD
        }
    })
    const mailOptions = {
        from:`"Cognizent tech info" <${process.env.EMAIL}>`,
        to :applicantEmails.join(","),
        subject:"Interview Invitation",
        text:`Dear Candidate 
          You have been invited for an interview.
                Date: ${date}
                Time: ${time}
                Location: ${location}
                Mode: ${mode}
          Please confirm your availability.
Best Regards,
HR Team`
    };
        await transporter.sendMail(mailOptions)
        return res.status(200).json({message:"Interview scheduled and emails sent successfully"})
  } catch (err) {
    console.error("Error scheduling interview:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

interviewCltr.interviewDetails = async(req,res)=>{
  try{
     const interviews = await Interview.find({applicants:req.currentUser.userId}).populate({path:"jobId",select:"jobtitle companyname"})
     if(!interviews){
        return res.status(400).json({error:"interviews not being found"})
     }
     res.status(200).json(interviews)
  }
  catch(err){
    console.log(err)
    return res.status(500).json("somethig went wrong")
  }
}



export default interviewCltr