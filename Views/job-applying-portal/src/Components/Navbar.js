import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaUserCircle,FaUser,FaSave,FaSignOutAlt,FaChartBar } from "react-icons/fa";
import "../index.css";


export default function Navbar() {
  const navigate = useNavigate();
  const { user, isloggedIn } = useSelector((state) => state.users);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          JobPortal
        </Link>

        <ul className="flex items-center space-x-6">
          <li>
            <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          </li>

          {isloggedIn ? (
            <>
              <li>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
              </li>

              {user?.role === "admin" && (
                <>
                <li>
                <Link to="/admindashboard" className="text-gray-700 hover:text-blue-500">
                      AdminDashboard
                    </Link>
                </li>
                  <li>
                    <Link to="/verifyRecruiters" className="text-gray-700 hover:text-blue-500">
                      Verify Recruiters
                    </Link>
                  </li>
                  <li>
                    <Link to="/jobFair" className="text-gray-700 hover:text-blue-500">
                      JobFair
                    </Link>
                  </li>
                  <li className="relative">
                <FaUserCircle
                  className="text-gray-700 text-3xl cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                
               {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                        <ul className="text-gray-700 text-center">
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => navigate("/adminProfile")} 
                          >
                            <FaUser color="blue"/> Profile
                          </li>
                      
                          <li
                            className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer flex items-center gap-2"
                            onClick={handleLogout}
                          >
                            <FaSignOutAlt /> Logout
                          </li>
                        </ul>
                      </div>
                    )}
              </li>
                
                </>
              )}

              {user.role === "recruiter" && (
                <>
                  <li>
                    <Link to="/jobposted" className="text-gray-700 hover:text-blue-500">
                      Posted Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/jobposting" className="text-gray-700 hover:text-blue-500">
                      Posting Job
                    </Link>
                  </li>
                  <li>
                    <Link to="/jobdetails" className="text-gray-700 hover:text-blue-500">
                      Job Details
                    </Link>
                  </li>
                  <li>
                    <Link to="/recruiterjobfair" className="text-gray-700 hover:text-blue-500">
                      Apply JobFair
                    </Link>
                  </li>
                  <li className="relative">
                <FaUserCircle
                  className="text-gray-700 text-3xl cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                
               {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                        <ul className="text-gray-700 text-center">
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => navigate("/recruiterProfile")} 
                          >
                            <FaUser color="blue"/> Profile
                          </li>
                       <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => navigate("/statistics")}
                          >
                           <FaChartBar  color="blue" /> Statistics
                          </li>
                       
                          <li
                            className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer flex items-center gap-2"
                            onClick={handleLogout}
                          >
                            <FaSignOutAlt /> Logout
                          </li>
                        </ul>
                      </div>
                    )}
              </li>
                  
                </>
              )}

              {user.role === "candidate" && (
                <>
                  <li>
                    <Link to="/searchJobs" className="text-gray-700 hover:text-blue-500">
                      Search Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/appliedjobs" className="text-gray-700 hover:text-blue-500">
                      Applied Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/candidate-calendar" className="text-gray-700 hover:text-blue-500">
                      Candidate Calendar
                    </Link>
                  </li>
                  <li>
                    <Link to="/candidate-jobFair" className="text-gray-700 hover:text-blue-500">
                      JobFair Signups
                    </Link>
                  </li>
             
            
              <li className="relative">
                <FaUserCircle
                  className="text-gray-700 text-3xl cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
               {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                        <ul className="text-gray-700 text-center">
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => navigate("/candidateProfile")}
                          >
                            <FaUser/> Profile
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => navigate("/saved-jobs")}
                          >
                            <FaSave /> Saved Jobs
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer flex items-center gap-2"
                            onClick={handleLogout}
                          >
                            <FaSignOutAlt /> Logout
                          </li>
                        </ul>
                      </div>
                    )}
              </li>
              </>
              )}
            </>
          ) : (
            <>
              <li>
                <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
              </li>
              
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
