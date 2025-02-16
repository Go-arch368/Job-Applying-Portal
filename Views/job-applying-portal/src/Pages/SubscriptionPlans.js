import React from "react";
import Navbar from "../Components/Navbar";
import plans from "../Components/Plans";


function SubscriptionPlans (){
  return (
    <div>
        <Navbar/>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Choose Your Plan</h2>
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border-2 ${plan.borderColor} shadow-md ${plan.bgColor} text-center flex flex-col items-center`}
          >
            <h3 className={`text-xl font-semibold ${plan.textColor} mb-3`}>{plan.name}</h3>
            <p className="text-2xl font-bold mb-5">{plan.price}</p>

            {/* Feature List - Ensuring Alignment */}
            <ul className="w-full text-left space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-gray-700 flex items-center justify-between w-full px-4">
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Subscribe Button */}
            <button className={`mt-6 px-6 py-2 rounded-lg text-white bg-opacity-90 hover:bg-opacity-100 transition ${plan.textColor}`}>
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default SubscriptionPlans;
