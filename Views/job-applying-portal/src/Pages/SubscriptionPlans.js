import React,{useEffect} from "react";
import Navbar from "../Components/Navbar";
import plans from "../Components/Plans"
import { useDispatch, useSelector } from "react-redux";
import {selectSubscription} from "../redux/slices/recruiterSlice";
import { recruiterDetails } from "../redux/slices/recruiterSlice";

function SubscriptionPlans (){
 const {sessionUrl,recruiterData} = useSelector((state)=>state.recruiter)
 console.log(recruiterData.subscriptionPlan)
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

 useEffect(()=>{
    dispatch(recruiterDetails())
 },[])

  return (
    <div>
        <Navbar/>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Choose Your Plan</h2>
      
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-center justify-center">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border-2 ${plan.borderColor} shadow-md ${plan.bgColor} text-center flex flex-col items-center ${recruiterData.subscriptionPlan === plan.name ? 'ring-4 ring-yellow-500 bg-yellow-200 scale-105 transform relative' : ''}`}
          >
            {recruiterData.subscriptionPlan === plan.name && <span className="absolute top-2 right-2 text-lg">⭐</span>}
            <h3 className={`text-xl font-semibold ${plan.textColor} mb-3`}>{plan.name}</h3>
            <p className="text-2xl font-bold mb-5">{plan.price}</p>

            <ul className="w-full text-left space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-gray-700 flex items-center justify-between w-full px-4">
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

         
            <button className={`mt-6 px-6 py-2 rounded-lg text-white ${plan.buttonColor} bg-opacity-90 hover:bg-opacity-100 transition`} onClick={()=>handleSubscribe(plan.name)}>
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
