import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCandidates, validateCandidates } from "../redux/slices/jobapplySlice";
import Navbar from "../Components/Navbar";
import { FaUserCircle, FaEnvelope, FaFileDownload, FaCheckCircle, FaTimesCircle, FaVideo, FaQuestionCircle, FaArrowLeft, FaCalendarCheck } from "react-icons/fa";
import { Loader } from "lucide-react";

export default function CandidateList() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  console.log(jobId);
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(getCandidates({ jobId }));
  }, []);

  const { data } = useSelector((state) => state.jobapplying);
  console.log(data);

  function handleAction(id, status) {
    console.log(id, status);
    dispatch(validateCandidates({ id, status }));
  }

  function handleInterview(){
     navigate("/jobdetails")
  }

  function goBack() {
    navigate(-1); // Goes to the previous page
}

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 pt-10 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <button 
                            onClick={goBack} 
                            className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors mb-4 font-bold text-sm"
                        >
                            <FaArrowLeft /> Back to Job List
                        </button>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Candidate Review Center</h1>
                        <p className="text-indigo-200 mt-2 text-lg">Evaluate and manage specialized talent for this requisition.</p>
                    </div>
                    {data.length > 0 && (
                        <button 
                            onClick={handleInterview} 
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            <FaCalendarCheck size={20} /> Schedule Mass Interview
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 -mt-12 relative z-20 pb-16">
                
                {data.length > 0 ? (
                    <div className="space-y-6 animate-fadeInUp">
                        {data.map((ele, index) => (
                            <div key={index} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-2xl">
                                
                                {/* Sidebar: Quick Info & Status */}
                                <div className="w-full md:w-72 bg-gray-50/50 p-8 border-r border-gray-100 flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
                                        {ele.user?.image ? (
                                             <img src={ele.user.image} alt="candidate" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <FaUserCircle size={64} />
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{ele.user?.name}</h2>
                                    <p className="text-sm text-gray-500 font-medium break-all flex items-center justify-center gap-1.5 mt-1">
                                        <FaEnvelope size={12} /> {ele.user?.email}
                                    </p>

                                    <div className="mt-8 w-full">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-3">Application Status</p>
                                        {ele.status === "pending" ? (
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                                                    onClick={() => handleAction(ele._id, "accepted")}
                                                >
                                                    <FaCheckCircle /> Accept
                                                </button>
                                                <button
                                                    className="w-full bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                                                    onClick={() => handleAction(ele._id, "rejected")}
                                                >
                                                    <FaTimesCircle /> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={`py-3 rounded-xl font-extrabold text-sm uppercase tracking-wide border-2 ${
                                                ele.status === "accepted" 
                                                ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                                                : "bg-red-50 border-red-100 text-red-600"
                                            }`}>
                                                {ele.status}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Main Content: Assessments & Media */}
                                <div className="flex-1 p-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        
                                        {/* Resume & Assessments */}
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <FaFileDownload className="text-indigo-500" /> Resume Record
                                                </h3>
                                                {ele.resumeUrl ? (
                                                    <a 
                                                        href={ele.resumeUrl} 
                                                        download 
                                                        className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 px-5 py-3 rounded-2xl font-bold border-2 border-indigo-100 hover:bg-indigo-100 transition-all"
                                                    >
                                                        <FaFileDownload size={18} /> Download Asset
                                                    </a>
                                                ) : (
                                                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center text-gray-400 text-sm font-medium">
                                                        No resume provided
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <FaQuestionCircle className="text-indigo-500" /> Evaluation Answers
                                                </h3>
                                                {ele?.answeredQuestions?.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {ele.answeredQuestions.map((q, qIndex) => (
                                                            <div key={qIndex} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                                <p className="text-xs font-bold text-gray-400 mb-1">{q.questionText}</p>
                                                                <p className="text-sm text-gray-700 font-semibold leading-relaxed">
                                                                    {q.startingTimestamp || "No response provided"}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-400 text-sm italic">Assessment not yet completed</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Video Screening */}
                                        <div>
                                            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <FaVideo className="text-indigo-500" /> Video Introduction
                                            </h3>
                                            {ele.videoUrl ? (
                                                <div className="relative group rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg bg-black aspect-video flex items-center justify-center">
                                                    <video controls className="w-full h-full">
                                                        <source src={ele.videoUrl} type="video/webm" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-gray-400 grayscale">
                                                    <FaVideo size={40} className="mb-2 opacity-30" />
                                                    <p className="text-xs font-bold uppercase tracking-widest">No Video Screening</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-16 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-6">
                            <FaUserCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Awaiting Candidates</h2>
                        <p className="text-gray-500 max-w-sm text-lg leading-relaxed">No applications have been received for this position yet. Try boosting your reach on social platforms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
