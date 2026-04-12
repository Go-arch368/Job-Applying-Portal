import Navbar from "../Components/Navbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { displayJobs, setEditJobId, deletingJob } from "../redux/slices/jobpostingSlice";
import { FaPlus, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaHistory, FaCalendarAlt, FaTools, FaTrash, FaEdit, FaUsers, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";

export default function PostedJobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const { data } = useSelector((state) => state.jobposting);
 

  useEffect(() => {
    dispatch(displayJobs());
  }, [dispatch]);

  function handleDelete(id) {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (confirm) {
      dispatch(deletingJob({ id })).unwrap().then(() => {
        dispatch(displayJobs());
      });
    }
  }

  function handlePost() {
    navigate("/jobposting");
  }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 pt-10 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Active Job Management</h1>
                            <p className="text-indigo-200 mt-2 text-lg">Track, edit, and review applicants for all your live requisitions.</p>
                        </div>
                        <button 
                            onClick={handlePost}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            <FaPlus /> Launch New Requisition
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 -mt-12 relative z-20 pb-16">
                
                {data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeInUp">
                        {data.map((ele, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:-translate-y-1">
                                {/* Header */}
                                <div className="p-6 border-b border-gray-50 relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                                <FaBriefcase size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 leading-tight">{ele.jobtitle}</h2>
                                                <p className="text-sm font-medium text-gray-500">{ele.companyname}</p>
                                            </div>
                                        </div>
                                        <span className="badge badge-indigo text-xs px-2.5 py-1 font-bold">
                                            {ele.jobtype}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                            <FaMapMarkerAlt /> {ele.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                            <FaMoneyBillWave /> {ele.salary}
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex-1 space-y-6">
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                        {ele.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <FaHistory size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Experience</p>
                                                <p className="text-xs font-bold text-gray-700">{ele.experienceRequired} Years</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                                <FaCalendarAlt size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Deadline</p>
                                                <p className="text-xs font-bold text-gray-700">{new Date(ele.deadline).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {ele.skillsrequired?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Required Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {ele.skillsrequired.slice(0, 4).map((skill, i) => (
                                                    <span key={i} className="bg-indigo-50 text-indigo-600 px-3 py-1 text-[11px] font-bold rounded-lg border border-indigo-100">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {ele.skillsrequired.length > 4 && (
                                                    <span className="text-xs font-bold text-gray-400 self-center">+{ele.skillsrequired.length - 4} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                                    <Link
                                        to={`/candidateList/${ele._id}`}
                                        className="bg-white border-2 border-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 hover:border-indigo-100 transition shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <FaUsers /> Review Candidates
                                    </Link>
                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 bg-white border-2 border-slate-100 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition shadow-sm flex items-center justify-center"
                                            onClick={() => {
                                                dispatch(setEditJobId(ele._id));
                                                navigate("/jobposting");
                                            }}
                                            title="Edit Requisition"
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            className="w-12 bg-red-50 text-red-600 border-2 border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition shadow-sm flex items-center justify-center hover:scale-105 active:scale-95"
                                            onClick={() => handleDelete(ele._id)}
                                            title="Delete Position"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-16 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center min-h-[500px]">
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mb-6">
                            <FaBriefcase size={40} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">No Jobs Posted Yet</h2>
                        <p className="text-gray-500 max-w-sm mb-10 text-lg leading-relaxed">Broadcast your company's talent needs to thousands of candidates worldwide.</p>
                        <button
                            onClick={handlePost}
                            className="btn-primary-gradient px-12 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            <FaPlus /> Post Your First Job
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}