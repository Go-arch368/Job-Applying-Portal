User Model:
    _id 
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        required:true
    }

const app = Applicant.findById(1)

Candidate.findById(app.candidateId)

Candidate.findOne({ userId: app.candidateId })

Candidate Model:
  _id : {}, 
  userId:{
     type:Schema.Types.ObjectId,
     ref:”User”
 },
   name:String,
   domainname:[],
  education: [ {title, startYear, endYear, institute, cgp}, {}],
   resumeUpload: [{ name: '', filePath }]
   savedJobs: [JobIds]

Recruiter Model:

      userId:{ 
        type:Schema.Types.ObjectId,
        ref:”user”
},
   name:String,
  company:String,
  location:String,
  website: String, 
  isVerfied: String 


Job Posting:
  jobtitle:String,
  
    description:String,
    location:String,
    jobtype:{
        type:String,
        enum:["parttime","fulltime","freelance","internship"]
    },
    salary:String,
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    deadline:Date,
  
Job Application (for candidate applying for job)

    jobId:{
        type:Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },

    applicantId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    },
    appliedAt:{
        type:Date,
        default:Date.now()
    },
    resumeLink:{
        type:String,
        required:true
        
    }
    

Questions: [

]

CandidateResponses 
    jobId
    questionId
    candidate
    filePath 

    
JobFair Model

    name:String,
    date:new Date(),
    location:String,
    description:String,
    recruiters:[{userId:{},companyname:String,role:String}],
    candidates:[{userId:{},email:String}],

Subscription {

}   

payment