import { useEffect, useState } from "react";
import { getAll, displayRegistered } from "../../redux/slices/jobFairSlice";
import { useDispatch, useSelector } from "react-redux";

export default function RegisteredRecruiters() {
    const dispatch = useDispatch();
    const [selectedJobFair, setSelectedJobFair] = useState("");

    useEffect(() => {
        dispatch(getAll());
    }, [dispatch]);

    const { data, registeredAll } = useSelector((state) => state.jobFair);
    console.log(data);
    console.log(registeredAll);

    const handleSelectJobFair = (event) => {
        const id = event.target.value;
        setSelectedJobFair(id);
        console.log(id);
        dispatch(displayRegistered({ id }));
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                Job Fair Recruiters
            </h2>

            <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Job Fair</h3>
            <select
                onChange={handleSelectJobFair}
                value={selectedJobFair}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
                <option value="" disabled>Select a job fair</option>
                {data.map((ele) => (
                    <option
                        key={ele._id}
                        value={ele._id}
                        disabled={new Date(ele.date) < new Date()}
                    >
                        {ele.name} - {new Date(ele.date).toDateString()}
                    </option>
                ))}
            </select>

            {/* Display registered recruiters if any */}
            {selectedJobFair && registeredAll?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Registered Recruiters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {registeredAll.map((ele) => (
                            <div
                                key={ele._id}
                                className="p-4 border rounded-lg bg-gray-50 shadow-md"
                            >
                                <p className="font-semibold text-blue-600">{ele.companyname}</p>
                                <p className="text-gray-700">{ele.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
