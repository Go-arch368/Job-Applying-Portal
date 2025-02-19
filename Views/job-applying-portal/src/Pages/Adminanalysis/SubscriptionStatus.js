import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { subscriptionStatus } from "../../redux/slices/adminVerifySlice";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function SubscriptionStatus() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(subscriptionStatus());
    }, [dispatch]);

    const { subscription } = useSelector((state) => state.adminVerify); 
    console.log(subscription);

    // Ensure data is in the right format
    const data = subscription
        ? Object.entries(subscription).map(([key, value]) => ({
              name: key.charAt(0).toUpperCase() + key.slice(1),
              value,
          }))
        : [];

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Content Area */}
            <div className="flex-1 p-6 ml-64">
                <h1 className="text-xl font-bold mb-4">Subscription Status</h1>

                {data.length > 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <PieChart width={400} height={400}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No subscription data available.</p>
                )}
            </div>
        </div>
    );
}
