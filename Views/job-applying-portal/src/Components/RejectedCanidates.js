import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRejected } from "../redux/slices/jobapplySlice";
import Navbar from "./Navbar";

export default function RejectedCandidates() {  // Renamed for consistency
    const dispatch = useDispatch();
    const { jobId } = useParams();
    
    const { rejected, serverError } = useSelector((state) => state.jobapplying);

    useEffect(() => {
        dispatch(getRejected({ jobId }));
    }, [dispatch, jobId]); // Added dependencies

    return (
        <div>
            <Navbar />
            <h1 className="text-xl font-bold">Rejected Candidates</h1>
            <div className="p-4">
                {rejected.length > 0 ? (
                    rejected.map((ele) => (
                        <div key={ele.applicantId._id} className="border p-4 my-2 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold">Username: {ele.applicantId.name}</h2>
                            <h3>Email: {ele.applicantId.email}</h3>
                            <h3>Status: <span className="text-red-600">{ele.status}</span></h3>
                        </div>
                    ))
                ) : (
                    <p className="text-red-500">{serverError}</p>
                )}
            </div>
        </div>
    );
}
