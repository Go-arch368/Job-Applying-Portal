import Navbar from "../Components/Navbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSaved,unSaveJobs } from "../redux/slices/jobapplySlice";

export default function SaveJobs() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getSaved());
    }, [dispatch]);

    const { savedJobs } = useSelector((state) => state.jobapplying);
    console.log(savedJobs);

    function handleUnsave(id){
       console.log(id)
       dispatch(unSaveJobs({id}))
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-5xl mx-auto mt-8 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Saved Jobs</h1>
                
                {savedJobs?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedJobs.map((ele, index) => (
                            <div key={index} className="bg-white shadow-lg rounded-lg p-5 border border-gray-200">
                                <h1 className="text-xl font-semibold text-gray-800">{ele?.jobtitle}</h1>
                                <h2 className="text-gray-600 font-medium">{ele?.companyname}</h2>
                                <p className="text-sm text-gray-500">{ele?.jobtype} • {ele?.location}</p>
                                <h3 className="text-lg font-semibold text-green-600 mt-2">₹{ele?.salary}</h3>
                                
                                <div className="mt-3">
                                    <h4 className="text-gray-700 font-medium">Required Skills:</h4>
                                    <div className="flex flex-wrap gap-2 mt-1 justify-center">
                                        {ele?.skillsrequired?.map((skill, idx) => (
                                            <span key={idx} className="bg-blue-500 text-white px-3 py-1 text-xs rounded-full">
                                                {skill}
                                              </span>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={()=>handleUnsave(ele._id)} className="bg-red-500 p-2 px-3 rounded-lg mt-4 text-white">Unsave</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center mt-6">No saved jobs yet.</p>
                )}
            </div>
        </div>
    );
}
