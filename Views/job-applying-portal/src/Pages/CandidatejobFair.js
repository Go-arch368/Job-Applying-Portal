import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { getAll, displayRegistered, candidatejobFair } from "../redux/slices/jobFairSlice";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function CandidatejobFair() {
    const dispatch = useDispatch();
    const [recruiterRegistered, setRecruiterRegistered] = useState(false);
    const [candidateErrors, setCandidateErrors] = useState({}); 
    

    useEffect(() => {
        dispatch(getAll());
    }, [dispatch]);

    const { data, registeredAll, candidateRegistered,candidateError,isLoading } = useSelector((state) => state.jobFair);
    const today = new Date()
    console.log(candidateRegistered);

    function handleRegister(id) {
        console.log(id);
        dispatch(candidatejobFair({ id }))
            .unwrap()
            .then(() => {
               // alert("successfully registered")
                toast("successfully registered")
            })
            .catch((error) => {
                setCandidateErrors((prev) => ({ ...prev, [id]: error }));
            });
    }

    useEffect(() => {
        console.log("Updated candidateRegistered:", candidateRegistered);
    }, [candidateRegistered]);
    

    function handleRecruiterRegistered(id) {
        console.log(id);
        setRecruiterRegistered(true);
        dispatch(displayRegistered({ id }));
    }

    return (
        <div className="bg-gray-200">
            <Navbar />

            {recruiterRegistered && <div className="fixed inset-0 bg-black opacity-50 z-10"></div>}

            <div className="grid grid-cols-2 gap-4 p-10">
                {data.length > 0 ? (
                    data.map((ele) =>{ 
                        const jobDate = new Date(ele.date)
                        const isExpired = jobDate<new Date()
                        return(
                        <div key={ele._id} className={`p-4 border rounded-lg shadow bg-white ${isExpired?"opacity-30 grayscale-50 bg-gray-100 ":"bg-white"}`}>
                            <h1 className="font-bold text-lg">Name: {ele.name}</h1>
                            <h2 className="text-gray-700">Description: {ele.description}</h2>
                            <h2 className="text-gray-700">
                                Date: {format(new Date(ele.date), "yyyy-MM-dd")}
                            </h2>
                            <h2 className="text-gray-700">Location: {ele.location}</h2>
                            <h3>
                                
                                {isExpired ? (
                                    <span className="text-red-500 font-semibold">Expired</span>
                                ) : (
                                    <span className="text-green-500">{ele.status}</span>
                                )}
                                </h3>

                            <div className="mt-4 flex gap-2 justify-center">
                            <button
                                    className={`border px-4 py-1 rounded ${
                                        candidateRegistered[ele._id] ? "bg-gray-400 text-white" : "bg-orange-400 text-white"
                                    }`}
                                    onClick={() => handleRegister(ele._id)}
                                    disabled={isExpired || candidateRegistered[ele._id]} // Disable if already registered
                                >
                                    {candidateRegistered[ele._id] ? "Registered" : "Register"}
                                </button>


                                <button className="border bg-red-500 text-white px-4 py-1 rounded" onClick={() => handleRecruiterRegistered(ele._id)} disabled={isExpired}>
                                    Companies Registered
                                </button>
                            </div>
                            {candidateErrors[ele._id] && <p style={{ color: "red" }}>{candidateErrors[ele._id]}</p>}
                        </div>
  )})
                ) : (
                    <p className="text-center text-gray-500">No job fairs available</p>
                )}
            </div>

            {recruiterRegistered && (
                <div className="fixed inset-0 flex items-center justify-center z-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                        <h2 className="text-center text-lg font-bold mb-4">Recruiters Registered</h2>
                        {registeredAll.length > 0 ? (
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 px-4 py-2">S.no</th>
                                        <th className="border border-gray-300 px-4 py-2">Company Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registeredAll.map((ele, index) => (
                                        <tr key={index} className="text-center">
                                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2">{ele.companyname}</td>
                                            <td className="border border-gray-300 px-4 py-2">{ele.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-500">No registered recruiters found</p>
                        )}

                        <div className="mt-4 flex justify-center">
                            <button onClick={() => setRecruiterRegistered(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
