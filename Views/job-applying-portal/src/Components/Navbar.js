import { Link, useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import "../index.css";
import PostingJobs from "../Pages/PostingJobs";

export default function Navbar() {

  const navigate = useNavigate()
  const { user, serverErrors, isloggedIn } = useSelector((state) => state.users);


  console.log("Is Logged In:", isloggedIn);
  console.log("User:", user);
  console.log("Server Errors:", serverErrors);

  function handleClick(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login")
    //dispatch(logout()); // Update Redux state
  }

  

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        
        
        <Link to="/" className="text-2xl font-bold text-blue-600">
          JobPortal
        </Link>

        <ul className="flex items-center space-x-6">
          <li>
            <Link to="/" className="text-gray-700 hover:text-blue-500">
              Home
            </Link>
          </li>

          {isloggedIn ? (
            <>
              <li>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">
                  Dashboard
                </Link>
              </li>

              {user?.role === "admin" && (
                <li>
                  <Link to="/verifyRecruiters" className="text-gray-700 hover:text-blue-500">
                    Verify Recruiters
                  </Link>
                </li>
              )}

              {user.role==="recruiter"&&(
                <li>
                    <Link to="/jobposting" className="text-gray-700 hover:text-blue-500">Posting Job</Link>
                </li>
              )}

             
              <li>
                <button
                  onClick={handleClick}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register" className="text-gray-700 hover:text-blue-500">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-700 hover:text-blue-500">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
  
