import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { postjob, updateJobDetails } from "../redux/slices/jobpostingSlice";
import { recruiterDetails } from "../redux/slices/recruiterSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaBriefcase, FaMoneyBillWave, FaMapMarkerAlt, FaUsers, FaAlignLeft, FaTools, FaHistory, FaCalendarAlt, FaPaperPlane, FaLock } from "react-icons/fa";

export default function PostingJobs() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {editJobId,data,serverErrors} = useSelector((state)=>state.jobposting)
    console.log(serverErrors);
    const {recruiterData} = useSelector((state)=>state.recruiter)
    console.log(recruiterData)
    console.log(data)
    console.log(editJobId)
    const [jobDetails, setJobDetails] = useState({
        jobtitle: "",
        salary: "",
        jobtype: "",
        noofOpenings: "",
        description: "",
        skillsrequired: [],
        experienceRequired: "",
        deadline: ""
    });
    
    const [clientErrors, setClientErrors] = useState({});
    
    const openings = ["parttime", "fulltime", "freelance", "internship"];

    useEffect(()=>{
       if(editJobId){
           const jobDetails = data.find((ele)=>ele._id==editJobId)
           console.log(jobDetails.jobtype)
           if(jobDetails){
              setJobDetails({
                jobtitle: jobDetails.jobtitle,
                salary: jobDetails.salary,
                jobtype: jobDetails.jobtype,
                noofOpenings: jobDetails.noofOpenings,
                description: jobDetails.description,
                skillsrequired: jobDetails.skillsrequired,  
                experienceRequired: jobDetails.experienceRequired,
                deadline: jobDetails.deadline,
                location:jobDetails.location
              })
           }
       }
    },[editJobId])

    useEffect(()=>{
       dispatch(recruiterDetails())
    },[dispatch])
    
    function validation() {
        let errors = {};
        if (!jobDetails.jobtitle) errors.jobtitle = "Job title is required";
        if (!jobDetails.salary) errors.salary = "Salary is required";
        if (!jobDetails.noofOpenings) errors.noofOpenings = "Number of openings is required";
        if (!jobDetails.description) errors.description = "Description is required";
        if (!jobDetails.skillsrequired) errors.skillsrequired = "Skills are required";
        if (!jobDetails.experienceRequired) errors.experienceRequired = "Experience is required";
        if(!jobDetails.location) errors.location = "location place is required"
        if (!jobDetails.deadline) errors.deadline = "Deadline is required";
        else if(new Date(jobDetails.deadline)<Date.now()){
            errors.deadline = "Deadline should be greater than today"
        }

        return errors;
    }
    
   
    function resetForm() {
        setJobDetails({
            jobtitle: "",
            salary: "",
            jobtype: "",
            location:"",
            noofOpenings: "",
            description: "",
            skillsrequired: "",
            experienceRequired: "",
            deadline: ""
        });
    }

    function handlePost(e) {
        e.preventDefault();
        const errors = validation();
        if (Object.keys(errors).length !== 0) {
            setClientErrors(errors);
        } else {
            if(editJobId){
                dispatch(updateJobDetails({editJobId,jobDetails,navigate}))
                // resetForm()
            }
            else{
                setClientErrors({});
                dispatch(postjob({ jobDetails, resetForm ,navigate}))
            }
          
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 pt-10 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {editJobId ? "Edit Job Requisition" : "Launch a New Requisition"}
                    </h1>
                    <p className="text-indigo-200 mt-2 text-lg">Broadcast your open roles to top talent matching your exact requirements.</p>
                </div>
            </div>

            <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 -mt-12 relative z-20 pb-16">
                
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeInUp p-8">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><FaBriefcase size={22} /></div>
                        <h3 className="text-xl font-bold text-gray-900">Position Details</h3>
                    </div>

                    <form onSubmit={handlePost} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job Title */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Job Title</label>
                                <div className="relative">
                                    <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.jobtitle ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                                        value={jobDetails.jobtitle}
                                        onChange={(e) => setJobDetails({ ...jobDetails, jobtitle: e.target.value })}
                                        placeholder="e.g. Senior Frontend Developer"
                                    />
                                </div>
                                {clientErrors.jobtitle && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{clientErrors.jobtitle}</p>}
                            </div>

                            {/* Job Type */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Job Type</label>
                                <div className="relative">
                                    <select
                                        onChange={(e) => setJobDetails({ ...jobDetails, jobtype: e.target.value })}
                                        value={jobDetails.jobtype || "choose"}
                                        className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none ${clientErrors.jobtype ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                                    >
                                        <option value="choose" disabled>Choose Type...</option>
                                        {openings.map((ele) => (
                                            <option value={ele} key={ele}>{ele.charAt(0).toUpperCase() + ele.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                {clientErrors.jobtype && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{clientErrors.jobtype}</p>}
                            </div>

                            {/* Salary */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Salary & Comp</label>
                                <div className="relative">
                                    <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.salary ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                                        value={jobDetails.salary}
                                        onChange={(e) => setJobDetails({ ...jobDetails, salary: e.target.value })}
                                        placeholder="e.g. $120k - $140k"
                                    />
                                </div>
                                {clientErrors.salary && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{clientErrors.salary}</p>}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Remote/Location</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.location ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                                        value={jobDetails.location}
                                        onChange={(e) => setJobDetails({ ...jobDetails, location: e.target.value })}
                                        placeholder="e.g. Remote, NY"
                                    />
                                </div>
                                {clientErrors.location && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{clientErrors.location}</p>}
                            </div>

                            {/* No. of Openings */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Number of Openings</label>
                                <div className="relative">
                                    <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.noofOpenings ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                                        value={jobDetails.noofOpenings}
                                        onChange={(e) => setJobDetails({ ...jobDetails, noofOpenings: e.target.value })}
                                        placeholder="e.g. 3"
                                    />
                                </div>
                                {clientErrors.noofOpenings && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{clientErrors.noofOpenings}</p>}
                            </div>
                            
                            {/* Deadline */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Application Deadline</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.deadline ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                                        value={jobDetails.deadline}
                                        onChange={(e) => setJobDetails({ ...jobDetails, deadline: e.target.value })}
                                    />
                                </div>
                                {clientErrors.deadline && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{clientErrors.deadline}</p>}
                            </div>

                            {/* Skills Required */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Skills Required (Comma separated)</label>
                                <div className="relative">
                                    <FaTools className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.skillsrequired ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                                        value={jobDetails.skillsrequired ? jobDetails.skillsrequired.join(", ") : ""}
                                        onChange={(e) => setJobDetails({ ...jobDetails, skillsrequired: e.target.value.split(",").map(skill => skill.trim()) })}
                                        placeholder="e.g. React, Node.js, TypeScript"
                                    />
                                </div>
                                {clientErrors.skillsrequired && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{clientErrors.skillsrequired}</p>}
                            </div>

                            {/* Experience Required */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Years of Experience Requested</label>
                                <div className="relative">
                                    <FaHistory className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.experienceRequired ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                                        value={jobDetails.experienceRequired}
                                        onChange={(e) => setJobDetails({ ...jobDetails, experienceRequired: e.target.value })}
                                        placeholder="e.g. 5"
                                    />
                                </div>
                                {clientErrors.experienceRequired && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{clientErrors.experienceRequired}</p>}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Job Description</label>
                                <div className="relative">
                                    <FaAlignLeft className="absolute left-4 top-4 text-gray-400" />
                                    <textarea
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none ${clientErrors.description ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                                        value={jobDetails.description}
                                        onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
                                        placeholder="Describe the day-to-day responsibilities, requirements, and benefits..."
                                        rows="6"
                                    />
                                </div>
                                {clientErrors.description && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{clientErrors.description}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-100">
                            <button type="submit" className="w-full btn-primary-gradient py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition">
                                <FaPaperPlane /> {editJobId ? "Save Job Edits" : "Broadcast Job Posting"}
                            </button>
                        </div>

                        {/* Server Errors */}
                        {serverErrors && <div className="bg-red-50 text-red-600 font-bold p-4 rounded-xl text-center border-2 border-red-200">{serverErrors}</div>}
                    </form>

                    {!recruiterData.isSubscribed && !editJobId && recruiterData.totalJobPosts <= recruiterData.jobPostingLimit && (
                        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-amber-100 text-amber-600 p-3 rounded-full"><FaLock size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Limits Reached Soon</h4>
                                    <p className="text-gray-600 font-medium text-sm">You have <span className="font-extrabold text-amber-600">{Math.abs(recruiterData.totalJobPosts-recruiterData.jobPostingLimit)}</span> free job posts left. Upgrade your tier to unlock unlimited postings.</p>
                                </div>
                            </div>
                            <Link to="/subscriptionpage" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-6 py-3 rounded-xl font-bold transition whitespace-nowrap shrink-0 shadow-md">
                                Upgrade Plan Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
