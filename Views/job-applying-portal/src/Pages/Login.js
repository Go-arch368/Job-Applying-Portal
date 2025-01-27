import { useState, useEffect } from "react";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/slices/usersSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const dispatch = useDispatch();
    const { isLoggedIn, serverErrors } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const [users, setUsers] = useState({
        email: "",
        password: "",
    });
    const [clientErrors, setClientErrors] = useState({});

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
            dispatch(userLogin({ users, resetForm }))
            navigate("/dashboard")
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        className="border"
                        value={users.email}
                        onChange={(e) => setUsers({ ...users, email: e.target.value })}
                    />
                    {clientErrors.email && <span style={{ color: "red" }}>{clientErrors.email}</span>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        className="border"
                        value={users.password}
                        onChange={(e) => setUsers({ ...users, password: e.target.value })}
                    />
                    {clientErrors.password && <span style={{ color: "red" }}>{clientErrors.password}</span>}
                </div>
                <button type="submit" className="border bg-blue-400 text-white p-2 px-3">
                    Login
                </button>
            </form>
        </div>
    );
}
