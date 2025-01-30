import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { useState } from "react";
import { postjob } from "../redux/slices/jobpostingSlice";
import { Navigate, useNavigate } from "react-router-dom";

export default function PostingJobs() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const {data} = useSelector((state)=>state.jobposting)
    // console.log(data)
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
    
    function validation() {
        let errors = {};
        if (!jobDetails.jobtitle) errors.jobtitle = "Job title is required";

        if (!jobDetails.salary) errors.salary = "Salary is required";

        if (!jobDetails.noofOpenings) errors.noofOpenings = "Number of openings is required";

        if (!jobDetails.description) errors.description = "Description is required";

        if (!jobDetails.skillsrequired.length) errors.skillsrequired = "Skills are required";

        if (!jobDetails.experienceRequired) errors.experienceRequired = "Experience is required";

        if (!jobDetails.deadline) errors.deadline = "Deadline is required";

        return errors;
    }
    
   
    function resetForm() {
        setJobDetails({
            jobtitle: "",
            salary: "",
            jobtype: "",
            noofOpenings: "",
            description: "",
            skillsrequired: [],
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
            setClientErrors({});
            dispatch(postjob({ jobDetails, resetForm ,navigate}))
        }
    }

    return (
        <div>
            <Navbar />
            <h1>Posting Jobs</h1>
            <form onSubmit={handlePost}>
                <div>
                    <label>Job title</label>
                    <input
                        type="text"
                        className="border"
                        value={jobDetails.jobtitle}
                        onChange={(e) => setJobDetails({ ...jobDetails, jobtitle: e.target.value })}
                        placeholder="Enter job title"
                    />
                    {clientErrors.jobtitle && <span style={{ color: "red" }}>{clientErrors.jobtitle}</span>}
                </div>
                
                <div>
                    <label>Job type</label>
                    <select
                        onChange={(e) => setJobDetails({ ...jobDetails, jobtype: e.target.value })}
                        className="border"
                    >
                        <option value="choose">Choose</option>
                        {openings.map((ele) => (
                            <option value={ele} key={ele}>{ele}</option>
                        ))}
                    </select>
                    {clientErrors.jobtype && <span style={{ color: "red" }}>{clientErrors.jobtype}</span>}
                </div>
                
                <div>
                    <label>Salary</label>
                    <input
                        type="text"
                        className="border"
                        value={jobDetails.salary}
                        onChange={(e) => setJobDetails({ ...jobDetails, salary: e.target.value })}
                        placeholder="Enter salary"
                    />
                    {clientErrors.salary && <span style={{ color: "red" }}>{clientErrors.salary}</span>}
                </div>
                
                <div>
                    <label>No of Openings</label>
                    <input
                        type="number"
                        className="border"
                        value={jobDetails.noofOpenings}
                        onChange={(e) => setJobDetails({ ...jobDetails, noofOpenings: e.target.value })}
                    />
                    {clientErrors.noofOpenings && <span style={{ color: "red" }}>{clientErrors.noofOpenings}</span>}
                </div>
                
                <div>
                    <label>Description</label>
                    <textarea
                        className="border"
                        value={jobDetails.description}
                        onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
                        placeholder="Enter job description"
                    />
                    {clientErrors.description && <span style={{ color: "red" }}>{clientErrors.description}</span>}
                </div>
                
                <div>
                    <label>Skills Required</label>
                    <input
                        type="text"
                        className="border"
                        value={jobDetails.skillsrequired.join(", ")}
                        onChange={(e) => setJobDetails({ ...jobDetails, skillsrequired: e.target.value.split(",") })}
                    />
                    {clientErrors.skillsrequired && <span style={{ color: "red" }}>{clientErrors.skillsrequired}</span>}
                </div>
                
                <div>
                    <label>Experience Required</label>
                    <input
                        type="number"
                        className="border"
                        value={jobDetails.experienceRequired}
                        onChange={(e) => setJobDetails({ ...jobDetails, experienceRequired: e.target.value })}
                    />
                    {clientErrors.experienceRequired && <span style={{ color: "red" }}>{clientErrors.experienceRequired}</span>}
                </div>
                
                <div>
                    <label>Deadline</label>
                    <input
                        type="date"
                        className="border"
                        value={jobDetails.deadline}
                        onChange={(e) => setJobDetails({ ...jobDetails, deadline: e.target.value })}
                    />
                    {clientErrors.deadline && <span style={{ color: "red" }}>{clientErrors.deadline}</span>}
                </div>
                
                <div>
                    <button type="submit" className="border p-2 bg-blue-700 text-white px-5 mt-3 rounded-lg">
                        Post Job
                    </button>
                </div>
            </form>
        </div>
    );
}
