import {Route,Routes} from "react-router-dom"
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import VerifyingRecruiters from "./Pages/VerifyingRecruiters";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import PostingJobs from "./Pages/PostingJobs";
import CreateQuestions from "./Pages/CreateQuestions";
import PostedJobs from "./Pages/PostedJobs";
import SearchJobs from "./Pages/SearchJobs";
import ApplyJobs from "./Pages/ApplyJobs";
import CandidateList from "./Pages/CandidateList";
import JobDetails from "./Pages/JobDetails";
import AcceptedCandidates from "./Components/AcceptedCandidates";
import RejectedCandidates from "./Components/RejectedCanidates";
import AppliedJobs from "./Pages/AppliedJobs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userRole } from "./redux/slices/usersSlice";
import CandidateCalendar from "./Pages/CandidateCalendar";
import JobFair from "./Pages/Admin/jobFair";
import CreateJobFair from "./Pages/Admin/CreateJobFair";
import ManageJobFair from "./Pages/Admin/ManageJobFairs";
import RecruiterjobFair from "./Pages/RecruiterjobFair";
import CandidatejobFair from "./Pages/CandidatejobFair";
import ProfileCandidate from "./Pages/ProfileCandidate";
import SaveJobs from "./Pages/SaveJobs";
import ProfileRecruiter from "./Pages/ProfileRecruiter";
import Statistics from "./Pages/Statistics";
import SubscriptionPlans from "./Pages/SubscriptionPlans";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";
function App() {
  const dispatch = useDispatch()
  const {isloggedIn} = useSelector((state)=>state.users)
  useEffect(()=>{
    dispatch(userRole())
  },[dispatch])

  if(localStorage.getItem("token")&&!isloggedIn){
    return <p style={{color:"red"}}>loading...</p>
  }

  return (
    <div className="text-center">
      
     <Routes>
      <Route path="/" element={<Home/>}/>
       <Route path="/register" element={<Register/>}/>
       <Route path="/login" element={<Login/>}/>
       <Route path="/dashboard" element={<Dashboard/>}/>
       <Route path="/verifyRecruiters" element={<VerifyingRecruiters/>}/>
       <Route path="/jobposting" element={<PostingJobs/>}/>
       <Route path="/create-questions/:jobId" element={<CreateQuestions/>}/>
       <Route path="/jobposted" element={<PostedJobs/>}/>
       <Route path="/searchJobs" element={<SearchJobs/>}/>
       <Route path="/apply/:jobId" element={<ApplyJobs/>} />
       <Route path="/candidateList/:jobId" element={<CandidateList/>}/>
       <Route path="/jobdetails" element={<JobDetails/>}/>
       <Route path="/accepted/:jobId" element={<AcceptedCandidates/>}/>
       <Route path="/rejected/:jobId" element={<RejectedCandidates/>}/>
       <Route path="/appliedjobs" element={<AppliedJobs/>}/>
       <Route path="/candidate-calendar" element={<CandidateCalendar/>}/>
       <Route path="/jobFair" element={<JobFair/>}/>
       <Route path="/createjobFair" element={<CreateJobFair/>} />
       <Route path="/managejobfair" element={<ManageJobFair/>} />
       <Route path="/recruiterjobfair" element={<RecruiterjobFair/>}/>
       <Route path="/candidate-jobFair" element={<CandidatejobFair/>}/>
       <Route path="/candidateProfile" element={<ProfileCandidate/>}/>
       <Route path="/saved-jobs" element={<SaveJobs/>}/>
       <Route path="/recruiterProfile" element={<ProfileRecruiter/>}/>
       <Route path="/statistics" element={<Statistics/>}/>
       <Route path="/subscriptionpage" element={<SubscriptionPlans/>} />
       <Route path="/success" element={<Success/>}/>
       <Route path="/cancel" element={<Cancel/>}/>
     </Routes>
    </div>
  );
}

export default App;
