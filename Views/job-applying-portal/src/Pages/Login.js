import { useState } from "react";
import validator from "validator";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/slices/usersSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt, FaTimes } from "react-icons/fa";

export default function Login({ onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [users, setUsers] = useState({
        email: "",
        password: "",
    });

    const [clientErrors, setClientErrors] = useState({});
    const { serverErrors, status } = useSelector((state) => state.users);
    
    function validation() {
        let errors = {};
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
        return errors;
    }

    function resetForm() {
        setUsers({ email: "", password: "" });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const errors = validation();
        if (Object.keys(errors).length !== 0) {
            setClientErrors(errors);
        } else {
            setClientErrors({});
            dispatch(userLogin({ users, resetForm, navigate })).unwrap()
            .then(()=>{
                toast.success("Successfully logged in!");
                if(onClose) onClose();
            })
            .catch((err)=>{
                console.log(err)
                toast.error("Invalid email or password");
            })    
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-[100]">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn relative overflow-hidden">
                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10">
                    <button 
                        onClick={onClose} 
                        className="absolute -top-2 -right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <FaTimes size={18} />
                    </button>
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FaSignInAlt className="text-2xl text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-500 mt-2 text-sm">Sign in to continue to JobFinder</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {typeof serverErrors === "string" && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center font-medium">
                                {serverErrors}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white hover:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.email ? 'border-red-300 ring-4 ring-red-500/10 focus:border-red-500' : ''}`}
                                    value={users.email}
                                    onChange={(e) => setUsers({ ...users, email: e.target.value })}
                                />
                            </div>
                            {clientErrors.email && <span className="text-red-500 text-xs font-medium ml-1 mt-1 inline-block">{clientErrors.email}</span>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white hover:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${clientErrors.password ? 'border-red-300 ring-4 ring-red-500/10 focus:border-red-500' : ''}`}
                                    value={users.password}
                                    onChange={(e) => setUsers({ ...users, password: e.target.value })}
                                />
                            </div>
                            {clientErrors.password && <span className="text-red-500 text-xs font-medium ml-1 mt-1 inline-block">{clientErrors.password}</span>}
                            {serverErrors && Array.isArray(serverErrors) && serverErrors
                                .filter((ele) => ele.path === "password")
                                .map((ele, index) => (
                                    <span key={index} className="text-red-500 text-xs font-medium ml-1 mt-1 inline-block">{ele.msg}</span>
                                ))}
                        </div>

                        <button 
                            type="submit" 
                            disabled={status === 'loading'}
                            className="w-full btn-primary-gradient py-3.5 rounded-xl text-sm font-bold mt-2 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {status === 'loading' ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button onClick={() => { if(onClose) onClose(); /* Assuming there's a way to trigger register from here or parent, maybe Link is better if it's a page */ }} className="text-indigo-600 font-bold hover:text-indigo-700">
                            Create an account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}