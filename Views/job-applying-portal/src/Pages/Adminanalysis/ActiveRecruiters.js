import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar'; 
import { useEffect } from 'react';
import { activeRecruiters } from '../../redux/slices/adminVerifySlice';

export default function ActiveRecruiters() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(activeRecruiters());
    }, [dispatch]);

    const { recruiterDetails } = useSelector((state) => state.adminVerify);
    
    // Getting all subscription plans
    const subscription = recruiterDetails?.job?.map((recruiter) => recruiter?.recruiterId?.subscriptionPlan);
    console.log(subscription);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <Sidebar />  

            {/* Main Content */}
            <div className="flex-1 p-6 ml-64">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Active Recruiters</h1>

                {/* Recruiters List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recruiterDetails?.recruiterData?.map((ele, index) => (
                        <div 
                            key={index} 
                            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105"
                        >
                            <h2 className="text-lg font-semibold text-gray-700">👤 {ele.name}</h2>
                            <p className="text-gray-600">✉️ <span className="font-medium flex justify-center">{ele.email}</span></p>

                            {/* Loop through all jobs and display the associated subscription plan */}
                            {recruiterDetails?.job?.map((job, subIndex) => {
                                if (job?.recruiterId?._id === ele._id) {
                                    return (
                                        <div key={subIndex} className="mt-2">
                                            <p className="text-gray-500">📜 Subscription Plan: {job.subscriptionPlan}</p>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
