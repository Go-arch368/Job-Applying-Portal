import { useState } from "react";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../redux/slices/usersSlice";
import RecruiterDetails from "./RecruiterDetails";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const { serverErrors } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [users, setUsers] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [clientErrors, setClientErrors] = useState({});
  const [showRecruiterForm, setShowRecruiterForm] = useState(false);

  function validation() {
    let errors = {};
    if (!users.name.trim()) {
      errors.name = "The name field is required";
    } else if (users.name.trim().length <= 3) {
      errors.name = "The name must be longer than 3 characters";
    } else if (!isNaN(users.name.trim()[0])) {
      errors.name = "The name cannot start with a number";
    }

    if (!users.email) {
      errors.email = "The email field is required";
    } else if (!validator.isEmail(users.email)) {
      errors.email = "The email should be in a valid format";
    }

    if (!users.password) {
      errors.password = "The password field is required";
    } else if (users.password.length < 8 || users.password.length > 20) {
      errors.password = "The password must be between 8 and 20 characters";
    }

    if (!users.role) {
      errors.role = "The role field is required";
    }

    return errors;
  }

  function resetForm() {
    setUsers({
      name: "",
      email: "",
      password: "",
      role: "",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errors = validation();
    if (Object.keys(errors).length !== 0) {
      setClientErrors(errors);
    } else {
      setClientErrors({});
      dispatch(userRegister({ users, resetForm }))
        .unwrap()
        .then((response) => {
          console.log("Registration successful!", response);
          if (users.role === "recruiter") {
            setShowRecruiterForm(true);
          } else {
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log("Registration failed:", err);
        });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Create Your Account
        </h1>

        {!showRecruiterForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <button type="button"  className={`w-1/2 p-2 border rounded-md ${users.role === "candidate" ? "bg-blue-500 text-white" : "bg-gray-200" }`}
                   onClick={() => setUsers({ ...users, role: "candidate" })}
              >
                Register as Candidate
              </button>
              <button type="button" className={`w-1/2 p-2 border rounded-md ${users.role === "recruiter"? "bg-blue-500 text-white": "bg-gray-200" }`}
                onClick={() => setUsers({ ...users, role: "recruiter" })}
              >
                Register as Recruiter
              </button>
            </div>
            {clientErrors.role && (
              <span className="text-red-500">{clientErrors.role}</span>
            )}

           
            {users.role && (
              <>
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={users.name}
                    onChange={(e) =>
                      setUsers({ ...users, name: e.target.value })
                    }
                  />
                  {clientErrors.name && (
                    <span className="text-red-500">{clientErrors.name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={users.email}
                    onChange={(e) =>
                      setUsers({ ...users, email: e.target.value })
                    }
                  />
                  {clientErrors.email && (
                    <span className="text-red-500">{clientErrors.email}</span>
                  )}
                  <br />
                  {serverErrors &&
                    serverErrors
                      .filter((ele) => ele.path === "email")
                      .map((ele) => (
                        <span key={ele.msg} className="text-red-500">
                          {ele.msg}
                        </span>
                      ))}
                </div>

                <div>
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={users.password}
                    onChange={(e) =>
                      setUsers({ ...users, password: e.target.value })
                    }
                  />
                  {clientErrors.password && (
                    <span className="text-red-500">{clientErrors.password}</span>
                  )}
                  <br />
                  {serverErrors &&
                    serverErrors
                      .filter((ele) => ele.path === "password")
                      .map((ele) => (
                        <span key={ele.msg} className="text-red-500">
                          {ele.msg}
                        </span>
                      ))}
                </div>
                <div>
                  <button
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    type="submit"
                  >
                    Register
                  </button>
                </div>
              </>
            )}
          </form>
        ) : (
          <RecruiterDetails users={users} />
        )}
      </div>
    </div>
  );
}
