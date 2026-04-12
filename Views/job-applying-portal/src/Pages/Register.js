import { useState } from "react";
import validator from "validator";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../redux/slices/usersSlice";
import RecruiterDetails from "./RecruiterDetails";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaTimes, FaBriefcase, FaGraduationCap } from "react-icons/fa";

const form = {
  name: "",
  email: "",
  password: "",
  role: "",
}

export default function Register({ onClose }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { serverErrors, status } = useSelector((state) => state.users);
    const [users, setUsers] = useState(form);

    const [clientErrors, setClientErrors] = useState({});
    const [showRecruiterForm, setShowRecruiterForm] = useState(false);
    const handleShowForm = ()=>{
      setShowRecruiterForm(prev=>!prev)
    }

    function validation() {
        let errors = {};
        if (!users.name.trim()) {
            errors.name = "Name is required";
        } else if (users.name.trim().length <= 3) {
            errors.name = "Name must be > 3 characters";
        } else if (!isNaN(users.name.trim()[0])) {
            errors.name = "Name cannot start with a number";
        }

        if (!users.email) {
            errors.email = "Email is required";
        } else if (!validator.isEmail(users.email)) {
            errors.email = "Invalid email format";
        }

        if (!users.password) {
            errors.password = "Password is required";
        } else if (users.password.length < 8 || users.password.length > 20) {
            errors.password = "Password must be 8-20 characters";
        }

        if (!users.role) {
            errors.role = "Please select a role";
        }

        return errors;
    }

    const resetForm =()=>  setUsers(form)

    function handleSubmit(e) {
        e.preventDefault();
        const errors = validation();
        if (Object.keys(errors).length !== 0) {
            setClientErrors(errors);
        } else {
            setClientErrors({});
            console.log(users);
            
            dispatch(userRegister({ users,resetForm }))
                .unwrap()
                .then((response) => {
                  console.log(response)
                  toast.success("Account created successfully!");
                    if (users.role === "recruiter") {
                        setShowRecruiterForm(true);
                    } else {
                        if(onClose) onClose();
                        navigate("/login");
                    }
                })
                .catch((err) => {
                  console.log("Registration failed:", err)
                  toast.error("Registration Failed! Please try again.");
        });
        }
    }

    return (
      <>
        {showRecruiterForm ? (
         <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-[100]">
         <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all animate-fadeIn max-h-[90vh] overflow-y-auto">
           <RecruiterDetails users={users} showRecruiterForm={showRecruiterForm} onclose={handleShowForm}/>
         </div>
       </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-[100]">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn relative overflow-hidden">
                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                  <button onClick={onClose} className="absolute -top-2 -right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <FaTimes size={18} />
                  </button>
                  
                  <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                      <p className="text-gray-500 mt-2 text-sm z-10 relative">Join JobFinder to accelerate your career or find top talent.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Role Selection Tabs */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">I am a...</label>
                        <div className="flex gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <button
                            type="button"
                            className={`flex flex-1 items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            users.role === "candidate" ? "bg-white text-indigo-600 shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => { setUsers({ ...users, role: "candidate" }); setClientErrors(prev => ({...prev, role: null})); }}
                        >
                            <FaGraduationCap size={16} className={users.role === "candidate" ? "text-indigo-500" : "text-gray-400"} /> Candidate
                        </button>
                        <button
                            type="button"
                            className={`flex flex-1 items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            users.role === "recruiter" ? "bg-white text-indigo-600 shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => { setUsers({ ...users, role: "recruiter" }); setClientErrors(prev => ({...prev, role: null})); }}
                        >
                            <FaBriefcase size={14} className={users.role === "recruiter" ? "text-indigo-500" : "text-gray-400"} /> Recruiter
                        </button>
                        </div>
                        {clientErrors.role && <span className="text-red-500 text-xs font-medium ml-1 mt-1 block text-center">{clientErrors.role}</span>}
                    </div>
        
                    {users.role && (
                      <div className="animate-fadeIn space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white hover:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.name ? 'border-red-300 ring-4 ring-red-500/10 focus:border-red-500' : ''}`}
                                        value={users.name}
                                        onChange={(e) => setUsers({ ...users, name: e.target.value })}
                                    />
                                </div>
                                {clientErrors.name && <span className="text-red-500 text-xs font-medium ml-1 mt-1 inline-block">{clientErrors.name}</span>}
                            </div>
            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white hover:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.email ? 'border-red-300 ring-4 ring-red-500/10 focus:border-red-500' : ''}`}
                                        value={users.email}
                                        onChange={(e) => setUsers({ ...users, email: e.target.value })}
                                    />
                                </div>
                                {clientErrors.email && <span className="text-red-500 text-xs font-medium ml-1 mt-1 inline-block">{clientErrors.email}</span>}
                                {serverErrors && Array.isArray(serverErrors) && serverErrors
                                    .filter((ele) => ele.path === "email")
                                    .map((ele, idx) => (
                                        <span key={idx} className="text-red-500 text-xs font-medium ml-1 mt-1 inline-block">{ele.msg}</span>
                                    ))}
                            </div>
            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="Create a strong password"
                                        className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white hover:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.password ? 'border-red-300 ring-4 ring-red-500/10 focus:border-red-500' : ''}`}
                                        value={users.password}
                                        onChange={(e) => setUsers({ ...users, password: e.target.value })}
                                    />
                                </div>
                                {clientErrors.password && <span className="text-red-500 text-xs font-medium ml-1 mt-1 inline-block">{clientErrors.password}</span>}
                                {serverErrors && Array.isArray(serverErrors) && serverErrors
                                    .filter((ele) => ele.path === "password")
                                    .map((ele, idx) => (
                                        <span key={idx} className="text-red-500 text-xs font-medium ml-1 mt-1 inline-block">{ele.msg}</span>
                                    ))}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={status === 'loading'}
                            className="w-full btn-primary-gradient py-3.5 rounded-xl text-sm font-bold mt-4 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {status === 'loading' ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : `Register as ${users.role.charAt(0).toUpperCase() + users.role.slice(1)}`}
                        </button>
                      </div>
                    )}
                  </form>
                  
                  <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={() => { if(onClose) { onClose(); /* Trigger login open ideally */ } }} className="text-indigo-600 font-bold hover:text-indigo-700">
                            Sign in
                        </button>
                  </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
}
