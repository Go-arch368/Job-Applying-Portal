import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaUser, FaSave, FaSignOutAlt, FaChartBar, FaCog, FaQuestionCircle, FaBriefcase, FaCalendarAlt, FaUsers, FaCrown } from "react-icons/fa";
import "../index.css";
import { logout } from "../redux/slices/usersSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isloggedIn } = useSelector((state) => state.users);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(logout());
    navigate("/");
  }

  const NavLink = ({ to, children, icon: Icon }) => (
    <li>
      <Link
        to={to}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
      >
        {Icon && <Icon size={14} />}
        {children}
      </Link>
    </li>
  );

  const DropdownItem = ({ onClick, icon: Icon, children, danger }) => (
    <li
      className={`px-4 py-3 cursor-pointer flex items-center gap-3 text-sm font-medium transition-all duration-150 ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
      onClick={() => { onClick(); setDropdownOpen(false); }}
    >
      <Icon size={15} className={danger ? "text-red-400" : "text-indigo-500"} />
      {children}
    </li>
  );

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold gradient-text flex items-center gap-1">
          ✦ JobFinder
        </Link>

        <ul className="flex items-center gap-1">
          {isloggedIn ? (
            <>
              <NavLink to="/dashboard" icon={FaBriefcase}>Dashboard</NavLink>

              {user?.role === "admin" && (
                <>
                  <NavLink to="/admindashboard" icon={FaChartBar}>Analysis</NavLink>
                  <NavLink to="/jobFair" icon={FaUsers}>JobFair</NavLink>
                </>
              )}

              {user?.role === "recruiter" && (
                <>
                  <NavLink to="/jobposting" icon={FaBriefcase}>Post Job</NavLink>
                  <NavLink to="/jobdetails">Job Details</NavLink>
                  <NavLink to="/recruiterjobfair" icon={FaUsers}>JobFair</NavLink>
                  <NavLink to="/subscriptionpage" icon={FaCrown}>Plans</NavLink>
                </>
              )}

              {user?.role === "candidate" && (
                <>
                  <NavLink to="/appliedjobs">Applied Jobs</NavLink>
                  <NavLink to="/candidate-calendar" icon={FaCalendarAlt}>Calendar</NavLink>
                  <NavLink to="/candidate-jobFair" icon={FaUsers}>JobFair</NavLink>
                </>
              )}

              {/* Profile Dropdown */}
              <li className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-indigo-200 transition-all duration-200"
                >
                  {user?.profile ? (
                    <img src={user.profile} alt="Profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-200" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="animate-slideDown absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 badge badge-indigo text-xs capitalize">{user?.role}</span>
                    </div>

                    <ul className="py-1">
                      {user?.role === "admin" && (
                        <DropdownItem onClick={() => navigate("/adminProfile")} icon={FaUser}>Profile</DropdownItem>
                      )}
                      {user?.role === "recruiter" && (
                        <>
                          <DropdownItem onClick={() => navigate("/recruiterProfile")} icon={FaUser}>Profile</DropdownItem>
                          <DropdownItem onClick={() => navigate("/statistics")} icon={FaChartBar}>Statistics</DropdownItem>
                          <DropdownItem onClick={() => navigate("/recruiter/queries")} icon={FaQuestionCircle}>Job Queries</DropdownItem>
                        </>
                      )}
                      {user?.role === "candidate" && (
                        <>
                          <DropdownItem onClick={() => navigate("/candidateProfile")} icon={FaUser}>Profile</DropdownItem>
                          <DropdownItem onClick={() => navigate("/saved-jobs")} icon={FaSave}>Saved Jobs</DropdownItem>
                        </>
                      )}
                      <DropdownItem onClick={() => navigate("/settings")} icon={FaCog}>Settings</DropdownItem>
                      <div className="border-t border-gray-100"></div>
                      <DropdownItem onClick={handleLogout} icon={FaSignOutAlt} danger>Logout</DropdownItem>
                    </ul>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="btn-primary-gradient px-5 py-2 rounded-xl text-sm font-semibold ml-1">
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
