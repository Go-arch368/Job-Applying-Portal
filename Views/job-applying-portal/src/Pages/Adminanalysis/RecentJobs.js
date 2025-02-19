import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { recentJobs } from "../../redux/slices/adminVerifySlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function RecentJobs() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(recentJobs());
    }, [dispatch]);

    const { recents } = useSelector((state) => state.adminVerify);
    console.log(recents);

    const chartData = recents?.lastTen?.map((ele) => ({
        jobTitle: ele.jobtitle,
        applicants: recents?.findingJob?.filter((e) => e.jobId === ele._id).length || 0,
    })) || [];

    const totalJobs = chartData.length;
    const jobsWithApplicants = chartData.filter(job => job.applicants > 0).length;
    const jobsWithoutApplicants = totalJobs - jobsWithApplicants;

    const pieData = [
        { name: "With Applicants", value: jobsWithApplicants },
        { name: "No Applicants", value: jobsWithoutApplicants }
    ];

    const COLORS = ["#0088FE", "#FF8042"];

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 ml-64">
                <h1 className="text-xl font-bold mb-4">Recruiter Job Applications</h1>

                <div className="grid grid-cols-2 gap-8">
                    {/* 📊 Bar Chart: Applicants per Job */}
                    <div className="p-4 border rounded shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Applicants per Job</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="jobTitle" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="applicants" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 🥧 Pie Chart: Jobs with vs. without applicants */}
                    <div className="p-4 border rounded shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Jobs with Applicants</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* List of Jobs */}
                <div className="mt-6">
                    {chartData.map((ele) => (
                        <div key={ele.jobTitle} className="p-4 border-b">
                            <h2 className="text-lg font-semibold">{ele.jobTitle}</h2>
                            <p>Applicants: {ele.applicants}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
