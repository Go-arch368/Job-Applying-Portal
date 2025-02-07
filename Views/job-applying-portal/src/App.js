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



function App() {
  const dispatch = useDispatch()
  const {isloggedIn} = useSelector((state)=>state.users)
  useEffect(()=>{
    dispatch(userRole())
  },[dispatch])

  if(!isloggedIn&&localStorage.getItem("token")){
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
     </Routes>
    </div>
  );
}

export default App;
