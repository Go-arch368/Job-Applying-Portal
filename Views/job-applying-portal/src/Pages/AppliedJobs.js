import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getApplied } from "../redux/slices/jobapplySlice";

export default function AppliedJobs() {
    const dispatch = useDispatch();
    const { applied } = useSelector((state) => state.jobapplying);

    const [search, setSearch] = useState("");
    const [sortby, setSortby] = useState("jobtitle");
    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);

    console.log(applied);

    useEffect(() => {
        dispatch(getApplied({ search, sortby, order, page, limit }));
    }, [dispatch, search, sortby, order, page, limit]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Applied Jobs</h1>

                {/* Search and Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <input 
                        type="search" 
                        value={search} 
                        placeholder="Search job title" 
                        onChange={(e) => setSearch(e.target.value)} 
                        className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 w-full sm:w-auto"
                    />
                    <select 
                        value={sortby} 
                        onChange={(e) => setSortby(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="jobtitle">Job Title</option>
                        <option value="companyname">Company Name</option>
                        <option value="status">Status</option>
                    </select>
                    <select 
                        value={order} 
                        onChange={(e) => setOrder(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <select 
                        value={limit} 
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                    </select>
                </div>

                {/* Jobs Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border">Job Title</th>
                                <th className="py-2 px-4 border">Company Name</th>
                                <th className="py-2 px-4 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applied?.data?.length > 0 ? (
                                applied.data.map((ele) => (
                                    <tr key={ele._id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border">{ele.jobId?.jobtitle || "N/A"}</td>
                                        <td className="py-2 px-4 border">{ele.jobId?.companyname || "N/A"}</td>
                                        <td className="py-2 px-4 border">{ele.status=="accepted"?<p className="text-green-500">accepted</p>:<p className="text-red-500">{ele.status}</p>}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">No applied jobs found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

               
                <div className="flex justify-between items-center mt-6">
                    <button 
                        disabled={page <= 1} 
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-gray-700">{page} of {applied?.totalPages}</span>
                    <button 
                        disabled={page == applied?.totalPages} 
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
