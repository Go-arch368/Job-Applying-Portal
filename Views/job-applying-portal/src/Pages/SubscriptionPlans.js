import React,{useEffect} from "react";
import Navbar from "../Components/Navbar";
import plans from "../Components/Plans"
import { useDispatch, useSelector } from "react-redux";
import {selectSubscription} from "../redux/slices/recruiterSlice";

function SubscriptionPlans (){
 const {sessionUrl} = useSelector((state)=>state.recruiter)
 const dispatch = useDispatch()
  function handleSubscribe(name){
  const plan = name
  console.log(plan);
  dispatch(selectSubscription({plan}))
} 

 useEffect(()=>{
  if(sessionUrl?.sessionUrl){
     window.location.href = sessionUrl.sessionUrl
  }else{
    console.log("No session Url being found");
    
  }
 },[sessionUrl])
  return (
    <div>
        <Navbar/>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Choose Your Plan</h2>
      
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-center justify-center">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border-2 ${plan.borderColor} shadow-md ${plan.bgColor} text-center flex flex-col items-center`}
          >
            <h3 className={`text-xl font-semibold ${plan.textColor} mb-3`}>{plan.name}</h3>
            <p className="text-2xl font-bold mb-5">{plan.price}</p>

            <ul className="w-full text-left space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-gray-700 flex items-center justify-between w-full px-4">
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

         
            <button className={`mt-6 px-6 py-2 rounded-lg text-white bg-opacity-90 hover:bg-opacity-100 transition ${plan.textColor}`} onClick={()=>handleSubscribe(plan.name)}>
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
