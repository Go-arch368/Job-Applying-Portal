import { useState } from "react";
import validator from "validator";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/slices/usersSlice";
import { useNavigate } from "react-router-dom";

export default function Login({ onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [users, setUsers] = useState({
        email: "",
        password: "",
    });

    const [clientErrors, setClientErrors] = useState({});
    const { serverErrors } = useSelector((state) => state.users);
    console.log(serverErrors);
    
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
                toast.success("LoggedIn Successfully")
            })
            .catch((err)=>{
                console.log(err)
                toast.error("Failed to Login!")
            })    
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all animate-fadeIn">
                <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-lg">
                    ✖️
                </button>
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {typeof serverErrors=="string" && <p className="text-red-500 text-center">{serverErrors}</p>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={users.email}
                            onChange={(e) => setUsers({ ...users, email: e.target.value })}
                        />
                        {clientErrors.email && <span className="text-red-500 text-sm">{clientErrors.email}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={users.password}
                            onChange={(e) => setUsers({ ...users, password: e.target.value })}
                        />
                        {clientErrors.password && <span className="text-red-500 text-sm">{clientErrors.password}</span>}
                       {serverErrors &&
  Array.isArray(serverErrors) &&
  serverErrors
    .filter((ele) => ele.path === "password")
    .map((ele, index) => (
      <p key={index} className="text-red-500">{ele.msg}</p>
    ))}

                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
                        Login
                    </button>
                    <p>don't have an account? <a href="/register" className="text-blue-700">register</a></p>
                </form>
            </div>
        </div>
    );
}