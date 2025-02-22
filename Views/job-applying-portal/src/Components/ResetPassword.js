import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { resetState, resetPasswordWithOldPassword } from "../redux/slices/resetPasswordSlice";

export default function ResetPassword() {
    const {user} = useSelector((state)=>state.users)
    const [email, setEmail] = useState(user?.email||"");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const dispatch = useDispatch();
    const { success, isLoading, error } = useSelector((state) => state.resetPassword);
    console.log(error)
    
   // console.log(user)
    const [clientError,setClientError] = useState("")

    function validation(){

       let errors={}
       if(!oldPassword){
        errors.oldPassword = "oldPassword field is required"
       }
       else if(oldPassword.length<=8){
        errors.newPassword = "newPassword field should contain atleast 8 characters"
       }

       if(!newPassword){
        errors.newPassword = "newPassword field is required"
       }
       else if(newPassword.length<=8){
        errors.newPassword = "newPassword field should contain atleast 8 characters"
       }

       return errors
    }


    function handleSubmit(e) {
       e.preventDefault()
      const errors = validation()
      
      if(Object.keys(errors).length!==0){
        setClientError(errors)
      }else{
        setClientError({})
        // if (newPassword.length < 8) {
        //     toast.error("New password must be at least 8 characters long.");
        //     return;
        // }
     
            console.log(email)
            dispatch(resetPasswordWithOldPassword({ email, oldPassword, newPassword })).unwrap()
            .then(()=>{
                toast.success("Password updated successfully!");
                   // setEmail("");
            // setOldPassword("");
            // setNewPassword("");
            })
            .catch((err)=>{
                toast.error(error || "Failed to reset password.");
            })
         
            
         
       
          
        
      }  
    }

    return (
        <div>
            <Navbar />
           
            <div className="max-w-md mx-auto mt-10 p-8 bg-white text-gray-800 rounded-2xl shadow-lg border border-gray-200">
  <h2 className="text-3xl font-bold mb-6 text-center">Reset Password</h2>
  {error&&<p className="text-red-500">{error}</p>}
  <form onSubmit={handleSubmit}>
    <div className="mb-5">
      <label className="block font-medium mb-2">Email</label>
      <input
        type="email"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={user?.email}
        onChange={(e) => setEmail(e.target.value)}
        disabled
        required
      />
      
    </div>
    <div className="mb-5">
      <label className="block font-medium mb-2">Old Password</label>
      <input
        type="password"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
  
      />
      {clientError.oldPassword&&<span className="text-red-500">{clientError.oldPassword}</span>}
    </div>
    <div className="mb-5">
      <label className="block font-medium mb-2">New Password</label>
      <input
        type="password"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
       
      />
      {clientError.newPassword&&<span className="text-red-500">{clientError.newPassword}</span>}
    </div>
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition duration-200"
    >
      {isLoading ? "Updating..." : "Reset Password"}
    </button>
  </form>
</div>

        </div>
    );
}
