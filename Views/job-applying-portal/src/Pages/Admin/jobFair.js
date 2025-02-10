import { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import CreateJobFair from "./CreateJobFair";
import ManageJobFair from "./ManageJobFairs";
import RegisteredCandidates from "./RegisteredCandidates";
import RegisteredRecruiters from "./RegisteredRecruiters";

export default function JobFair() {
  const [activeTab, setActiveTab] = useState("dashboard"); 

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-5"> 
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "create" && <CreateJobFair />}
        {activeTab === "manage" && <ManageJobFair />}
        {activeTab === "recruiters" && <RegisteredRecruiters />}
        {activeTab === "candidates" && <RegisteredCandidates />}
      </div>
    </div>
  );
}
