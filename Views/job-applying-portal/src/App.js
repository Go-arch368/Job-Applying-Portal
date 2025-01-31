import {Route,Routes} from "react-router-dom"
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import VerifyingRecruiters from "./Pages/VerifyingRecruiters";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import PostingJobs from "./Pages/PostingJobs";
import CreateQuestions from "./Pages/CreateQuestions";
import PostedJobs from "./Pages/PostedJobs";
function App() {
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
     </Routes>
    </div>
  );
}

export default App;
