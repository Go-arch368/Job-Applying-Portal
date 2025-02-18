import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { recruiters } from "../../redux/slices/adminVerifySlice";

export default function TotalRecruiters() {
    const dispatch = useDispatch();
    const [expandedRecruiter, setExpandedRecruiter] = useState(null); // Track expanded recruiter

    useEffect(() => {
        dispatch(recruiters());
    }, [dispatch]);

    const { recruiterDetails } = useSelector((state) => state.adminVerify) || {};

    // Toggle function to expand/collapse recruiter details
    const toggleJobs = (recruiterId) => {
        setExpandedRecruiter((prev) => (prev === recruiterId ? null : recruiterId));
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />

            <div className="flex-1 p-6 ml-64">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Total Recruiters</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recruiterDetails?.user?.map((ele) => {
                        const recruiterJobs = recruiterDetails?.job?.filter(
                            (job) => job.recruiterId === String(ele._id)
                        );

                        return (
                            <div key={ele?.userId?._id} className="relative">
                                {/* Recruiter Card */}
                                <div
                                    onClick={() => toggleJobs(ele?.userId?._id)}
                                    className={`cursor-pointer bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl ${
                                        expandedRecruiter === ele?.userId?._id ? "border-blue-500 shadow-xl" : ""
                                    }`}
                                >
                                 <h2 className="text-lg font-semibold text-gray-700">👤 {ele?.userId?.name}</h2>

                                    <p className="text-gray-600">✉️ <span className="font-medium">{ele?.userId?.email}</span></p>
                                </div>

                                {/* Job Listings - Expand when clicked */}
                                {expandedRecruiter === ele?.userId?._id && (
                                    <div className="mt-2 p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300">
                                        <h3 className="text-md font-semibold mb-2">📋 Posted Jobs:</h3>
                                        {recruiterJobs.length > 0 ? (
                                            recruiterJobs.map((data) => (
                                                <div key={data._id} className="mb-2 p-3 bg-white rounded-md border border-gray-200 shadow">
                                                    <p className="text-lg font-semibold text-gray-800">📌 {data.jobtitle}</p>
                                                    <p className="text-gray-600">🏢 <span className="font-medium">{data.companyname}</span></p>
                                                    <p className="text-gray-600">📍 <span className="font-medium">{data.location}</span></p>
                                                    <p className="text-gray-500 text-sm">🗓 Deadline: {data.deadline}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-sm">No jobs posted yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
