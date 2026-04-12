import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getApplied, getTotalApplied } from "../redux/slices/jobapplySlice";
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaBriefcase, FaBuilding, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaExternalLinkAlt } from "react-icons/fa";
import { Loader } from "lucide-react";

export default function AppliedJobs() {
    const dispatch = useDispatch();
    const { applied } = useSelector((state) => state.jobapplying);
    console.log(applied)
    const [search, setSearch] = useState("");
    const [sortby, setSortby] = useState("jobtitle");
    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);

    console.log(applied);

    useEffect(() => {
        dispatch(getApplied({ search, sortby, order, page, limit }));
    }, [dispatch, search, sortby, order, page, limit]);

    useEffect(()=>{
        dispatch(getTotalApplied())
    },[dispatch])

    const getStatusIcon = (status) => {
        switch (status) {
            case "accepted": return <FaCheckCircle className="text-emerald-500" />;
            case "rejected": return <FaTimesCircle className="text-red-500" />;
            default: return <FaHourglassHalf className="text-amber-500" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "accepted": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "rejected": return "bg-red-50 text-red-700 border-red-100";
            default: return "bg-amber-50 text-amber-700 border-amber-100";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 pt-10 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Your Hiring Pipeline</h1>
                    <p className="text-indigo-200 mt-2 text-lg">Track your application status and career progress in real-time.</p>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 -mt-12 relative z-20 pb-16">
                
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center animate-fadeInUp">
                    <div className="relative flex-1 w-full">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="search" 
                            value={search} 
                            placeholder="Filter by job title or company..." 
                            onChange={(e) => setSearch(e.target.value)} 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-xl text-sm font-medium transition-all outline-none"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 rounded-xl border border-gray-100">
                            <FaFilter className="text-gray-400" size={12} />
                            <select 
                                value={sortby} 
                                onChange={(e) => setSortby(e.target.value)}
                                className="bg-transparent py-3 text-sm font-bold text-gray-600 outline-none cursor-pointer"
                            >
                                <option value="jobtitle">Sort by Title</option>
                                <option value="companyname">Sort by Company</option>
                                <option value="status">Sort by Status</option>
                            </select>
                        </div>

                        <select 
                            value={order} 
                            onChange={(e) => setOrder(e.target.value)}
                            className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>

                        <select 
                            value={limit} 
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            <option value="4">Show 4</option>
                            <option value="8">Show 8</option>
                            <option value="12">Show 12</option>
                        </select>
                    </div>
                </div>

                {/* Applications Grid */}
                <div className="grid grid-cols-1 gap-6 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                    {applied?.data?.length > 0 ? (
                        applied.data.map((ele) => (
                            <div key={ele._id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all flex flex-col md:flex-row">
                                {/* Left Section: Job & Company */}
                                <div className="p-8 md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-gray-50 bg-gray-50/30">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600 border border-gray-100">
                                            <FaBriefcase size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                                {ele.jobId?.jobtitle}
                                            </h3>
                                            <p className="text-indigo-600 font-bold text-sm flex items-center gap-1.5 mt-1">
                                                <FaBuilding size={12} /> {ele.jobId?.companyname}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        <span className="badge badge-indigo text-xs px-3 py-1 font-bold">
                                            {ele.jobId?.jobtype}
                                        </span>
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold border border-gray-200">
                                            Applied {new Date(ele.createdAt || Date.now()).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Section: Status Pipeline */}
                                <div className="flex-1 p-8 flex flex-col justify-center">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                        
                                        {/* Status Steps */}
                                        <div className="flex-1 w-full max-w-2xl">
                                            <div className="relative flex justify-between">
                                                {/* Connecting Line */}
                                                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 -z-0">
                                                    <div 
                                                        className={`h-full transition-all duration-1000 ${ele.status === 'accepted' ? 'w-full bg-emerald-400' : 'w-1/2 bg-amber-400'}`}
                                                    ></div>
                                                </div>

                                                {/* Steps */}
                                                {[
                                                    { label: "Submitted", icon: <FaCheckCircle />, active: true, color: "text-indigo-500" },
                                                    { label: "Under Review", icon: <FaClock />, active: true, color: "text-amber-500" },
                                                    { label: "Final Decision", 
                                                      icon: ele.status === 'accepted' ? <FaCheckCircle /> : ele.status === 'rejected' ? <FaTimesCircle /> : <FaHourglassHalf />, 
                                                      active: ele.status !== 'pending', 
                                                      color: ele.status === 'accepted' ? "text-emerald-500" : ele.status === 'rejected' ? "text-red-500" : "text-gray-300" 
                                                    }
                                                ].map((step, i) => (
                                                    <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 shadow-sm transition-all duration-500 ${
                                                            step.active ? `bg-white border-white ${step.color}` : "bg-gray-100 border-gray-50 text-gray-400"
                                                        }`}>
                                                            {step.icon}
                                                        </div>
                                                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${step.active ? "text-gray-900" : "text-gray-400"}`}>
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status Badge & Action */}
                                        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                                            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 font-extrabold text-sm uppercase tracking-wider ${getStatusClass(ele.status)}`}>
                                                {getStatusIcon(ele.status)}
                                                {ele.status}
                                            </div>
                                            <button className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-2 transition-all">
                                                View Details <FaExternalLinkAlt size={10} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl p-16 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-6">
                                <FaBriefcase size={48} />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">No Applications Yet</h2>
                            <p className="text-gray-500 max-w-sm text-lg leading-relaxed">Your future starts here. Start searching for jobs and launch your next career move!</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {applied?.totalPages > 1 && (
                    <div className="mt-10 flex justify-center items-center gap-6">
                        <button 
                            disabled={page <= 1} 
                            onClick={() => setPage(page - 1)}
                            className="p-3 rounded-xl bg-white border border-gray-200 text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <FaChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Page</span>
                            <span className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-100">
                                {page}
                            </span>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">of {applied?.totalPages}</span>
                        </div>
                        <button 
                            disabled={page === applied?.totalPages} 
                            onClick={() => setPage(page + 1)}
                            className="p-3 rounded-xl bg-white border border-gray-200 text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <FaChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
