import Navbar from "../Components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getRecruiters, updateVerificationStatus, deleteRecruiter } from "../redux/slices/adminVerifySlice";
import { FaUserShield, FaBuilding, FaMapMarkerAlt, FaGlobe, FaEnvelope, FaCheckCircle, FaTrashAlt, FaInfoCircle, FaInbox } from "react-icons/fa";

export default function VerifyingRecruiters() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.adminVerify);
   console.log(data)
  useEffect(() => {
    dispatch(getRecruiters());
  }, [dispatch]);

  function handleClick(ele) {
    const verify = window.confirm("Are you Sure your want to verify?")
    if(verify){
        dispatch(updateVerificationStatus({ _id: ele._id, isVerified: true })).unwrap()
      .then(()=>dispatch(getRecruiters()))
    }
  }

  function handleDelete(ele){
    const deleting = window.confirm("Are you sure to delete the document")
    if(deleting){
        dispatch(deleteRecruiter({_id:ele._id}))
    }
  }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 pt-10 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-indigo-400">
                            <FaUserShield size={28} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Recruiter Audit Center</h1>
                    </div>
                    <p className="text-slate-400 mt-2 text-lg max-w-2xl">Verified businesses maintain the integrity of our platform. Review and authorize new recruiter accounts.</p>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 -mt-12 relative z-20 pb-16">
                
                {data?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 animate-fadeInUp">
                        {data.map((ele) => (
                            <div key={ele._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all">
                                <div className="p-8">
                                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                                        
                                        {/* Company Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                                                    <FaBuilding size={20} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{ele.companyname || "Unnamed Entity"}</h2>
                                                    <p className="text-indigo-600 font-bold text-sm flex items-center gap-1.5">
                                                        <FaEnvelope size={12} /> {ele.userId?.email || "No email provided"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                                        <FaMapMarkerAlt size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">Headquarters</p>
                                                        <p className="text-sm font-bold text-gray-700">{ele.location || "Private Location"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                                        <FaGlobe size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">Corporate Site</p>
                                                        {ele.website ? (
                                                            <a href={ele.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-600 hover:underline">
                                                                {ele.website.replace(/^https?:\/\//, '')}
                                                            </a>
                                                        ) : (
                                                            <p className="text-sm font-bold text-gray-400">Not provided</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-3 text-gray-400">
                                                    <FaInfoCircle size={14} />
                                                    <span className="text-xs font-extrabold uppercase tracking-widest">Company Overview</span>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {ele.description || "The recruiter has not provided a specialized description yet."}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Audit Controls */}
                                        <div className="lg:w-64 flex flex-col justify-center gap-3">
                                            <div className="text-center mb-4">
                                                <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border border-amber-100">
                                                    Pending Verification
                                                </span>
                                            </div>
                                            <button
                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-95"
                                                onClick={() => handleClick(ele)}
                                            >
                                                <FaCheckCircle /> Approve Recruiter
                                            </button>
                                            <button 
                                                className="w-full bg-white border-2 border-red-50 text-red-500 hover:bg-red-50 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95" 
                                                onClick={() => handleDelete(ele)}
                                            >
                                                <FaTrashAlt /> Reject Application
                                            </button> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-16 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center min-h-[500px]">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-400 rounded-full flex items-center justify-center mb-6">
                            <FaInbox size={40} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Verification Queue Clear</h2>
                        <p className="text-gray-500 max-w-sm text-lg leading-relaxed">All pending recruiter applications have been processed. New requests will appear here as they arrive.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


