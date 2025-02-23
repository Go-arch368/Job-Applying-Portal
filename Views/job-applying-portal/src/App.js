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
import AdminDashboard from "./Pages/Adminanalysis/AdminDashboard";
import ActiveRecruiters from "./Pages/Adminanalysis/ActiveRecruiters";
import TopApplicants from "./Pages/Adminanalysis/TopApplicants";
import TotalCandidates from "./Pages/Adminanalysis/TotalCandidates";
import TotalRecruiters from "./Pages/Adminanalysis/TotalRecruiters";
import TotalJobs from "./Pages/Adminanalysis/TotalJobs";
import ApplicationStatus from "./Pages/Adminanalysis/ApplicationStatus";
import SubscriptionStatus from "./Pages/Adminanalysis/SubscriptionStatus";
import RecentJobs from "./Pages/Adminanalysis/RecentJobs";
import ProfileAdmin from "./Pages/ProfileAdmin";
import PrivateRoute from "./Components/PrivateRoute";
import UnauthorizedPage from "./Components/UnauthorizedPage";
import Settings from "./Components/Settings";
import ResetPassword from "./Components/ResetPassword";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        <ToastContainer position="top-right" autoClose={3000} /> 
     

     <Routes>
       <Route path="/searchJobs" element={<SearchJobs/>}/>
       <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
       <Route path="/" element={<Home/>}/>
       <Route path="/register" element={<Register/>}/>
       <Route path="/login" element={<Login/>}/>
       <Route path="/dashboard" element={<Dashboard/>}/>
       <Route path="/verifyRecruiters" element={<PrivateRoute role="admin"><VerifyingRecruiters/></PrivateRoute>}/>
       <Route path="/jobposting" element={<PrivateRoute role="recruiter"><PostingJobs/></PrivateRoute>}/>
       <Route path="/create-questions/:jobId" element={<PrivateRoute role="recruiter"><CreateQuestions/></PrivateRoute>}/>
       <Route path="/jobposted" element={<PrivateRoute role="recruiter"><PostedJobs/></PrivateRoute>}/>
       <Route path="/apply/:jobId" element={<PrivateRoute role="candidate"><ApplyJobs/></PrivateRoute>} />
       <Route path="/candidateList/:jobId" element={<PrivateRoute role="recruiter"><CandidateList/></PrivateRoute>}/>
       <Route path="/jobdetails" element={<PrivateRoute role="recruiter"><JobDetails/></PrivateRoute>}/>
       <Route path="/accepted/:jobId" element={<PrivateRoute role="recruiter"><AcceptedCandidates/></PrivateRoute>}/>
       <Route path="/rejected/:jobId" element={<PrivateRoute role="recruiter"><RejectedCandidates/></PrivateRoute>}/>
       <Route path="/appliedjobs" element={<PrivateRoute role="candidate"><AppliedJobs/></PrivateRoute>}/>
       <Route path="/candidate-calendar" element={<PrivateRoute role="candidate"><CandidateCalendar/></PrivateRoute>}/>
       <Route path="/jobFair" element={<PrivateRoute role="admin"><JobFair/></PrivateRoute>}/>
       <Route path="/createjobFair" element={<PrivateRoute role="admin"><CreateJobFair/></PrivateRoute>} />
       <Route path="/managejobfair" element={<PrivateRoute role="admin"><ManageJobFair/></PrivateRoute>} />
       <Route path="/recruiterjobfair" element={<PrivateRoute role="recruiter"><RecruiterjobFair/></PrivateRoute>}/>
       <Route path="/candidate-jobFair" element={<PrivateRoute role="candidate"><CandidatejobFair/></PrivateRoute>}/>
       <Route path="/candidateProfile" element={<PrivateRoute role="candidate"><ProfileCandidate/></PrivateRoute>}/>
       <Route path="/saved-jobs" element={<PrivateRoute role="candidate"><SaveJobs/></PrivateRoute>}/>
       <Route path="/recruiterProfile" element={<PrivateRoute role="recruiter"><ProfileRecruiter/></PrivateRoute>}/>
       <Route path="/statistics" element={<PrivateRoute role="recruiter"><Statistics/></PrivateRoute>}/>
       <Route path="/subscriptionpage" element={<PrivateRoute role="recruiter"><SubscriptionPlans/></PrivateRoute>} />
       <Route path="/success" element={<Success/>}/>
       <Route path="/cancel" element={<Cancel/>}/>
       <Route path="/admindashboard" element={<PrivateRoute role="admin"><AdminDashboard/></PrivateRoute>}/>
       <Route path="/admin/active-recruiters" element={<PrivateRoute role="admin"><ActiveRecruiters /></PrivateRoute>} />
       <Route path="/admin/total-candidates" element={<PrivateRoute role="admin"><TotalCandidates /></PrivateRoute>} />
       <Route path="/admin/total-jobs" element={<PrivateRoute role="admin"><TotalJobs /></PrivateRoute>} />
       <Route path="/admin/top-applicants" element={<PrivateRoute role="admin"><TopApplicants/></PrivateRoute>} />
       <Route path="/admin/total-recruiters" element={<PrivateRoute role="admin"><TotalRecruiters/></PrivateRoute>}/>
       <Route path="/admin/application-status" element={<PrivateRoute role="admin"><ApplicationStatus/></PrivateRoute>}/>
       <Route path="/admin/subscription-status" element={<PrivateRoute role="admin"><SubscriptionStatus/></PrivateRoute>}/>
       <Route path="/admin/recent-jobs" element={<PrivateRoute role="admin"><RecentJobs/></PrivateRoute>}/>
       <Route path="/adminProfile" element={<PrivateRoute role="admin"><ProfileAdmin/></PrivateRoute>}/>
       <Route path="/settings" element={<Settings/>}/>
       <Route path="/resetpassword" element={<ResetPassword/>} />
     </Routes>
    </div>
  );
}

export default App;
