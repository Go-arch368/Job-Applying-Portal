import { useState } from "react";
import Sidebar from "./Sidebar";

import CreateJobFair from "./CreateJobFair";
import ManageJobFair from "./ManageJobFairs";
import RegisteredCandidates from "./RegisteredCandidates";
import RegisteredRecruiters from "./RegisteredRecruiters";

export default function JobFair() {
  const [activeTab, setActiveTab] = useState("create"); // ✅ Default to first tab

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />

      {/* Main Content Area */}
      <div className="ml-64 flex-grow p-6 bg-gray-100 min-h-screen">
        {activeTab === "create" && <CreateJobFair />}
        {activeTab === "manage" && <ManageJobFair />}
        {activeTab === "recruiters" && <RegisteredRecruiters />}
        {activeTab === "candidates" && <RegisteredCandidates />}
      </div>
    </div>
  );
}
