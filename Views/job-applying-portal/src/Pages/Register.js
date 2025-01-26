import { useState } from "react";
import validator from "validator";
import { useDispatch } from "react-redux";
import { userRegister } from "../redux/slices/usersSlice";

export default function Register() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [clientErrors, setClientErrors] = useState({});

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
      errors.password =
        "The password must contain between 8 and 20 characters";
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
      dispatch(userRegister({ users, resetForm }));
      console.log("Form submitted successfully!", users);
    }
  }

  return (
    <div>
      <h1>Create Your Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            className={`border p-2 ${
              users.role === "candidate" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setUsers({ ...users, role: "candidate" })}
          >
            Register as Candidate
          </button>
          <button
            type="button"
            className={`border p-2 ${
              users.role === "recruiter" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setUsers({ ...users, role: "recruiter" })}
          >
            Register as Recruiter
          </button>
        </div>

        {clientErrors.role && (
          <span style={{ color: "red" }}>{clientErrors.role}</span>
        )}

        {users.role && (
          <>
            <div>
              <label>Name</label>
              <input
                type="text"
                className="border"
                value={users.name}
                onChange={(e) => setUsers({ ...users, name: e.target.value })}
              />
              {clientErrors.name && (
                <span style={{ color: "red" }}>{clientErrors.name}</span>
              )}
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                className="border"
                value={users.email}
                onChange={(e) => setUsers({ ...users, email: e.target.value })}
              />
              {clientErrors.email && (
                <span style={{ color: "red" }}>{clientErrors.email}</span>
              )}
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                className="border"
                value={users.password}
                onChange={(e) =>
                  setUsers({ ...users, password: e.target.value })
                }
              />
              {clientErrors.password && (
                <span style={{ color: "red" }}>{clientErrors.password}</span>
              )}
            </div>

            <div>
              <button className="border" type="submit">
                Register
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
