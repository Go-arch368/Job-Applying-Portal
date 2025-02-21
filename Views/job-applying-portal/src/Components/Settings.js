import Navbar from "./Navbar"
import { Link } from "react-router-dom"
export default function Settings(){
    return(
       <div>
        <Navbar/>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">

  
  <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
    <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Settings</h1>

    {/* Privacy Section */}
    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Privacy</h2>
      
      <div className="flex items-center justify-between">
        <h3 className="text-gray-600 text-lg">Change your password</h3>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-md font-medium hover:scale-105 transition-transform duration-300">
        <Link to="/resetpassword">Reset Password</Link>  
        </button>
      </div>
    </div>
  </div>
</div>
       </div>  
    )
}