import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { postjob,updateJobDetails} from "../redux/slices/jobpostingSlice";
import { recruiterDetails } from "../redux/slices/recruiterSlice";
import {  useNavigate,Link } from "react-router-dom";

export default function PostingJobs() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {editJobId,data,serverErrors} = useSelector((state)=>state.jobposting)
    console.log(serverErrors);
    const {recruiterData} = useSelector((state)=>state.recruiter)
    
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
        <div>
              <Navbar />
           <div className="min-h-screen bg-gray-100 flex flex-col items-center">
          
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 mt-6">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                    {editJobId ? "Edit Job" : "Post a Job"}
                </h1>
                <form onSubmit={handlePost} className="space-y-4">
                    
                    {/* Job Title */}
                    <div>
                        <label className="block font-medium text-gray-700">Job Title</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={jobDetails.jobtitle}
                            onChange={(e) => setJobDetails({ ...jobDetails, jobtitle: e.target.value })}
                            placeholder="Enter job title"
                        />
                        {clientErrors.jobtitle && <p className="text-red-500 text-sm mt-1">{clientErrors.jobtitle}</p>}
                    </div>

                    {/* Job Type */}
                    <div>
                        <label className="block font-medium text-gray-700">Job Type</label>
                        <select
                            onChange={(e) => setJobDetails({ ...jobDetails, jobtype: e.target.value })}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="choose">Choose</option>
                            {openings.map((ele) => (
                                <option value={ele} key={ele}>{ele}</option>
                            ))}
                        </select>
                        {clientErrors.jobtype && <p className="text-red-500 text-sm mt-1">{clientErrors.jobtype}</p>}
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block font-medium text-gray-700">Salary</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={jobDetails.salary}
                            onChange={(e) => setJobDetails({ ...jobDetails, salary: e.target.value })}
                            placeholder="Enter salary"
                        />
                        {clientErrors.salary && <p className="text-red-500 text-sm mt-1">{clientErrors.salary}</p>}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={jobDetails.location}
                            onChange={(e) => setJobDetails({ ...jobDetails, location: e.target.value })}
                            placeholder="Enter location"
                        />
                    </div>

                    {/* No. of Openings */}
                    <div>
                        <label className="block font-medium text-gray-700">No of Openings</label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={jobDetails.noofOpenings}
                            onChange={(e) => setJobDetails({ ...jobDetails, noofOpenings: e.target.value })}
                        />
                        {clientErrors.noofOpenings && <p className="text-red-500 text-sm mt-1">{clientErrors.noofOpenings}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium text-gray-700">Description</label>
                        <textarea
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={jobDetails.description}
                            onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
                            placeholder="Enter job description"
                            rows="4"
                        />
                        {clientErrors.description && <p className="text-red-500 text-sm mt-1">{clientErrors.description}</p>}
                    </div>

                    {/* Skills Required */}
                    <div>
                        <label className="block font-medium text-gray-700">Skills Required</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={jobDetails.skillsrequired ? jobDetails.skillsrequired.join(", ") : ""}
                            onChange={(e) => setJobDetails({ ...jobDetails, skillsrequired: e.target.value.split(",").map(skill => skill.trim()) })}
                        />
                        {clientErrors.skillsrequired && <p className="text-red-500 text-sm mt-1">{clientErrors.skillsrequired}</p>}
                    </div>

                    {/* Experience Required */}
                    <div>
                        <label className="block font-medium text-gray-700">Experience Required (years)</label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={jobDetails.experienceRequired}
                            onChange={(e) => setJobDetails({ ...jobDetails, experienceRequired: e.target.value })}
                        />
                        {clientErrors.experienceRequired && <p className="text-red-500 text-sm mt-1">{clientErrors.experienceRequired}</p>}
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block font-medium text-gray-700">Application Deadline</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={jobDetails.deadline}
                            onChange={(e) => setJobDetails({ ...jobDetails, deadline: e.target.value })}
                        />
                        {clientErrors.deadline && <p className="text-red-500 text-sm mt-1">{clientErrors.deadline}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition">
                            {editJobId ? "Edit Job" : "Post Job"}
                        </button>
                    </div>

                    {/* Server Errors */}
                    {serverErrors && <p className="text-red-600 text-center mt-3">{serverErrors}</p>}
                </form>
                {!editJobId&&recruiterData.totalJobPosts<=recruiterData.jobPostingLimit &&(
                    <div className="bg-yellow-200 text-black p-3 rounded-md mt-4">
                        <div className="mt-2">
                        <p >You have {recruiterData.totalJobPosts-recruiterData.jobPostingLimit} free job posts left. Upgrade now for unlimited postings!</p>
                        </div>
                        <div className="mt-2 ">
                         <button className="bg-blue-600 text-white px-3 py-1 rounded-md ml-2 mb-3 "><Link to="/subscriptionpage">Upgrade Now</Link></button>
                         </div>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}
