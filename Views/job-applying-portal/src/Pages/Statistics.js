import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { displayJobs } from "../redux/slices/jobpostingSlice";
import { getCandidates } from "../redux/slices/jobapplySlice";
import { PieChart, Cell, Tooltip, Legend, Pie, ResponsiveContainer } from "recharts";

export default function Statistics() {
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState(false);
  const [loading, setLoading] = useState(false); 
  const { data } = useSelector((state) => state.jobposting);
  const value = useSelector((state) => state.jobapplying);

  const appliedlength = Array.isArray(value.data) ? value.data.length : 0;

  useEffect(() => {
    dispatch(displayJobs());
  }, [dispatch]);

  function handleStat(jobId, views) {   
    setView(true);
    setLoading(true)
    setChartData([]);
    dispatch(getCandidates({ jobId })).then((res) => {
      const appliedCount = Array.isArray(res?.payload) ? res.payload.length : 0;
      setChartData([
        { name: "Views", value: views },
        { name: "Applied", value: appliedCount }
      ]);
    });
  } 

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">S.No</th>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((ele, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{ele.jobtitle}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleStat(ele._id, ele.clicks)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                      >
                        View Statistics
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No job postings available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {view && chartData.length > 0 && chartData.some(entry => entry.value > 0) ? (
          <div className="bg-white mt-5 p-6">
            <h2>Applicants & Views</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`Cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-900 bg-white p-6 mt-7">
            No one has clicked or updated yet
          </div>
        )}
      </div>
    </div>
  );
}
