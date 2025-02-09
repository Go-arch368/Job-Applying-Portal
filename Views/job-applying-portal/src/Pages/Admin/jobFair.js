import { useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import CreateJobFair from "./CreateJobFair";
import ManageJobFair from "./ManageJobFairs";
import RegisteredCandidates from "./RegisteredCandidates";
import RegisteredRecruiters from "./RegisteredRecruiters";

export default function JobFair() {
    const [activeTab, setActiveTab] = useState("dashboard"); // Fixed typo

    return (
        <div className="flex"> {/* Added flex to make sidebar and content side by side */}
        <Sidebar setActiveTab={setActiveTab} />
        <div className="flex-1 p-5"> {/* Added flex-1 to take remaining space */}
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "create" && <CreateJobFair />}
            {activeTab === "manage" && <ManageJobFair />}
            {activeTab === "recruiters" && <RegisteredRecruiters />}
            {activeTab === "candidates" && <RegisteredCandidates />}
        </div>
    </div>
    );
}
