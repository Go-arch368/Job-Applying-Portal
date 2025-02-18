import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { candidates } from "../../redux/slices/adminVerifySlice";
import { getTotalApplied } from "../../redux/slices/jobapplySlice";

export default function TotalCandidates() {
    const dispatch = useDispatch();
    const [expandedCandidate, setExpandedCandidate] = useState(null); // Track which candidate is expanded

    useEffect(() => {
        dispatch(candidates());
        dispatch(getTotalApplied());
    }, [dispatch]);

    const { candidatesDetails } = useSelector((state) => state.adminVerify) || {};

    // Toggle function to expand/collapse only one candidate at a time
    const toggleAppliedJobs = (candidateId) => {
        setExpandedCandidate((prev) => (prev === candidateId ? null : candidateId)); // Collapse if already expanded, else expand
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6 ml-64">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Total Candidates</h1>

                {/* Candidates List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidatesDetails?.totalCandidates?.map((ele) => (
                        <div key={ele._id} className="relative">
                            {/* Candidate Card */}
                            <div
                                onClick={() => toggleAppliedJobs(ele._id)} // Click to expand/collapse
                                className={`cursor-pointer bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl ${
                                    expandedCandidate === ele._id ? "border-blue-500 shadow-xl" : ""
                                }`}
                            >
                                <h2 className="text-lg font-semibold text-gray-700">👤 {ele.name}</h2>
                                <p className="text-gray-600">✉️ <span className="font-medium">{ele.email}</span></p>
                            </div>

                            {/* Applied Jobs - Shown only if this candidate is expanded */}
                            {expandedCandidate === ele._id && (
                                <div className="mt-2 p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300">
                                    {candidatesDetails?.jobApplications
                                        ?.filter((job) => job.applicantId === ele._id)
                                        .map((data, appIndex) => (
                                            <div key={appIndex} className="mb-2 p-3 bg-white rounded-md border border-gray-200 shadow">
                                                <p className="text-lg font-semibold text-gray-800">📝 {data.jobId.jobtitle}</p>
                                                <p className="text-gray-600">🏢 <span className="font-medium">{data.jobId.companyname}</span></p>
                                                <p className="text-gray-600">📍 <span className="font-medium">{data.jobId.location}</span></p>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
