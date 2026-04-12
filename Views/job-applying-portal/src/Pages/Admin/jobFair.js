import { useState } from "react";
import Sidebar from "./Sidebar";

import CreateJobFair from "./CreateJobFair";
import ManageJobFair from "./ManageJobFairs";
import RegisteredCandidates from "./RegisteredCandidates";
import RegisteredRecruiters from "./RegisteredRecruiters";

export default function JobFair() {
  const [activeTab, setActiveTab] = useState("create"); // Default to first tab

  // Render the corresponding component based on the activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateJobFair />;
      case "manage":
        return <ManageJobFair />;
      case "recruiters":
        return <RegisteredRecruiters />;
      case "candidates":
        return <RegisteredCandidates />;
      default:
        return <CreateJobFair />; // Fallback to CreateJobFair
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />

      {/* Main Content Area */}
      <div className="ml-64 flex-grow p-6 bg-gray-100 min-h-screen">
        {renderContent()}
      </div>
    </div>
  );
}