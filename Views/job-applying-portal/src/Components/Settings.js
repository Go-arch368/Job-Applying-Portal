import Navbar from "./Navbar"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { recruiterDetails } from "../redux/slices/recruiterSlice"
export default function Settings(){
  const {recruiterData} = useSelector((state)=>state.recruiter)
  const {user} = useSelector((state)=>state.users)
  console.log(user)
  console.log(recruiterData.subscriptionPlan)
  const dispatch = useDispatch()
  useEffect(()=>{
     dispatch(recruiterDetails())
  },[])
  console.log(recruiterData)
    return(
      <div>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-3xl p-10 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Settings</h1>

        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Privacy</h2>

          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-lg">Change your password</h3>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium hover:scale-105 transition-transform duration-300">
                <Link to="/resetpassword">Reset Password</Link>
              </button>
            </div>
            {user.role=="recruiter"&&<>
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center font-medium">
              Current Subscription Plan: <span className="font-bold">{recruiterData.subscriptionPlan}</span>
            </div>
            </>}
           
          </div>
        </div>
      </div>
    </div>
  </div>
    )
}