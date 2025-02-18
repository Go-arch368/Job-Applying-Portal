import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { applicationStatus } from "../../redux/slices/adminVerifySlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ApplicationStatus() {
    const dispatch = useDispatch();
    const { applicationDetails } = useSelector((state) => state.adminVerify);

    useEffect(() => {
        dispatch(applicationStatus());
    }, [dispatch]);

    // Ensure data is formatted correctly
    const chartData = applicationDetails?.data?.map(item => ({
        status: item._id, 
        count: item.count
    })) || [];

    return (
        <div className="flex bg-gray-100 min-h-screen">
          
            <Sidebar />

        
            <div className="flex-1 p-6 ml-64">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Application Status</h1>

               
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4F46E5" barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
