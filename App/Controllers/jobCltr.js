import Job from "../Models/jobmodel.js";
import Question from "../Models/questionmodel.js";
import Recruiter from "../Models/recruitermodel.js";
import { validationResult } from "express-validator";
const jobCltr = {}




jobCltr.posting = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { jobtitle, description, experienceRequired, salary, jobtype, deadline, skillsrequired } = req.body;
    console.log(req.body)

    if (!["parttime", "fulltime", "freelance", "internship"].includes(jobtype)) {
        return res.status(400).json({ error: "Invalid job type" });
    }

    try {
        // Find recruiter to get location and company name
        const recruiter = await Recruiter.findOne({ userId: req.currentUser.userId });
        if (!recruiter) {
            return res.status(400).json({ error: "Recruiter not found" });
        }

        // Create the job posting
        const jobPosting = await Job.create({
            jobtitle,
            description,
            location: recruiter.location,
            companyname: recruiter.companyname,
            experienceRequired,
            skillsrequired,
            salary,
            recruiterId: req.currentUser.userId,
            jobtype,
            deadline,
        });

        return res.status(201).json(jobPosting);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};




jobCltr.gettingQuestions = async(req,res)=>{
    try {
        const { jobId } = req.params;
        //const questions = await Question.findOne({jobId:req.param})
        // const job = await Job.findById(jobId)
        // if (!job) {
        //     return res.status(404).json({ error: "Job not found" });
        // }
       const questions = await Question.find({ jobId })
       let data=questions[0].questions
       const randomQuestions = data.sort(()=>0.5-Math.random()).slice(0,3)//compare shuffle
      console.log(randomQuestions)
        //job.assignedQuestions=questions 
     return res.status(201).json(randomQuestions)

       // return res.status(200).json(job);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

jobCltr.getAll=async(req,res)=>{
    try{
        const recruiter = await Recruiter.findOne({userId:req.currentUser.userId})
        if(!recruiter){
            return res.status(400).json("no recruiter is being found")
        }
       
       // console.log(question.questions)
        if(req.currentUser.role==="recruiter"){
            const jobs = await Job.find({recruiterId:req.currentUser.userId}).lean()
         // console.log(job);
            if(!jobs){
                return res.status(400).json("No job posting is found for this recruiter")
            }
            const questions = await Question.find({createdBy:recruiter._id})
            if(!questions){
                return res.status(400).json("no quesitions is found for these job")
            }
        //    const questionData = question.map((ele)=>ele.questions).flat()
        //    const viewQuestions =  questionData.map((ele)=>ele.questionText)
        //    console.log(viewQuestions)

           const jobsWithQuestions = jobs.map((job) => {
            const matchedQuestions = questions
                .filter((q) => q.jobId.toString() === job._id.toString())
                .flatMap((q)=>q.questions.map((ele)=>ele.questionText)) // Match job ID
                 // Extract question qtexts

            return {
                ...job,
                assignedQuestions: matchedQuestions
            };
        });
           console.log(jobsWithQuestions)
     
       
         
            return res.status(200).json(jobsWithQuestions)
        }
        else if(req.currentUser.role=="admin"){
            const fetchAll = await Job.find()
            return res.status(200).json(fetchAll)
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

jobCltr.searching=async(req,res)=>{
    try{
        const {title,location} = req.query
        //console.log(title)
        //console.log(location)
    
        let query={}
        if(title){
            query.title={$regex:title,$options:"i"}
        }
        if(location){
            query.location={$regex:location,$options:"i"}
        }
        //console.log(query)
        if(!title&&!location){
            return res.status(400).json("atleast one field needed to be filled")
        }
       
        const jobs = await Job.find({...query})
        
        //console.log(jobs)
       
      
        if(jobs.length==0){
            return  res.status(400).json("no documents found")
        }

      const gettingQuestions = await Promise.all(
        jobs.map(async(job)=>{
            const questions = await Question.findOne({jobId:job._id})

            const recruiter = await Recruiter.findOne({userId:job.recruiterId})
      
            return {

                ...job.toObject(),

                assignedQuestions:questions.questions,  recruiterId:recruiter
              
            }
        })
      )

        return res.json(gettingQuestions)
    } 
    catch(err){
        console.log(err)
        return res.status(500).json("something went wrong")
    }
}

export default jobCltr