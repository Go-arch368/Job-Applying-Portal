import { useState, useEffect } from "react";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/slices/usersSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const dispatch = useDispatch();
   
    const navigate = useNavigate();
    
    const [users, setUsers] = useState({
        email: "",
        password: "",
    });
    const [clientErrors, setClientErrors] = useState({});
    

    const {serverErrors} = useSelector((state)=>state.users)

    // Watch for changes to isLoggedIn to trigger navigation
    /*  useEffect(() => {
        if (isLoggedIn) {
            navigate("/dashboard");
        }
    }, [isLoggedIn, navigate]); */

    function validation() {
        let errors = {};
        if (!users.email) {
            errors.email = "The email field is required";
        } else if (!validator.isEmail(users.email)) {
            errors.email = "The email should be in a valid format";
        }

        if (!users.password) {
            errors.password = "The password field is required";
        } else if (users.password.length < 8 || users.password.length > 20) {
            errors.password = "The password must contain between 8 and 20 characters";
        }
        return errors;
    }

    function resetForm() {
        setUsers({
            email: "",
            password: "",
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const errors = validation();
        if (Object.keys(errors).length !== 0) {
            setClientErrors(errors);
        } else {
            setClientErrors({});
            dispatch(userLogin({ users, resetForm ,navigate}))
            
        }
    }

    return (
      
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <h2>{serverErrors && <p className="text-red-500 text-center">{serverErrors}</p>}</h2>
                </div>
    
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={users.email}
                        onChange={(e) => setUsers({ ...users, email: e.target.value })}
                    />
                    {clientErrors.email && <span className="text-red-500 text-sm">{clientErrors.email}</span>}
                </div>
    
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={users.password}
                        onChange={(e) => setUsers({ ...users, password: e.target.value })}
                    />
                    {clientErrors.password && <span className="text-red-500 text-sm">{clientErrors.password}</span>}
                </div>
    
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>
            </form>
        </div>
    </div>
    
    );
}
