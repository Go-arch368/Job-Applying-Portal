import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchingJobs, saveJobs, withOutSearch, getSaved } from "../redux/slices/jobapplySlice";
import { countJobClick } from "../redux/slices/jobpostingSlice";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaClock, FaMoneyBillWave, FaSave, FaPaperPlane, FaInfoCircle, FaCalendarAlt, FaStar, FaChevronRight } from "react-icons/fa";

export default function SearchJobs() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    jobtitle: searchParams.get("jobtitle") || "",
    location: searchParams.get("location") || "",
  });
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const { data, searchError, savedJobs, savedError, isloading } = useSelector((state) => state.jobapplying);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!token && !hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    dispatch(getSaved());
  }, [dispatch]);

  useEffect(() => {
    const initJobTitle = searchParams.get("jobtitle") || "";
    const initLocation = searchParams.get("location") || "";

    setSearch({ jobtitle: initJobTitle, location: initLocation });
    setSelectedJob(null);
    if (initJobTitle.trim() || initLocation.trim()) {
      dispatch(searchingJobs({ jobtitle: initJobTitle, location: initLocation }))
        .unwrap()
        .then(() => setError(null))
        .catch((err) => setError(err?.error || err?.message || "Something went wrong"));
    } else {
      dispatch(withOutSearch());
    }
  }, [dispatch, searchParams]);

  function handleSubmit(e) {
    e.preventDefault();
    const { location, jobtitle } = search;

    if (!location.trim() && !jobtitle.trim()) {
      setError("Please provide at least one detail to search.");
      setSelectedJob(null);
      dispatch(withOutSearch());
      setSearchParams({});
      return;
    }

    setSearchParams({ jobtitle: jobtitle.trim(), location: location.trim() });
    setSelectedJob(null);

    dispatch(
      searchingJobs({
        jobtitle: jobtitle.trim(),
        location: location.trim()
      })
    )
      .unwrap()
      .then(() => setError(null))
      .catch((err) => setError(err?.error || err?.message || "Something went wrong"));
  }

  function handleJobClick(job) {
    setSelectedJob(job);
    const id = job._id;
    dispatch(countJobClick({ id }));
  };

  function handleSaveJobs(id) {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to save jobs")
      navigate("/login")
      return;
    }
    if (savedJobs?.some((job) => job._id == id)) {
      toast.info("Job already saved in your list")
      return
    }
    dispatch(saveJobs({ id }))
      .unwrap()
      .then(()=> toast.success("Job saved successfully!"))
      .catch(()=> toast.error("Failed to save job"));
  }

  useEffect(() => {
    if (data && data.length > 0 && !selectedJob) {
      setSelectedJob(data[0])
    }
  }, [data, selectedJob])

  function handleApply() {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to apply for this job")
      navigate("/login")
    }
  }

  function handleInquire() {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to inquire about this job")
      navigate("/login")
    }
  }

  const isJobSaved = (id) => Array.isArray(savedJobs) && savedJobs?.some((ele) => ele?._id === id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 pt-16 pb-24 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Find Your Next Big Opportunity</h1>
          
          <form onSubmit={handleSubmit} className="glass-card bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-4xl mx-auto shadow-2xl">
              <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                      type="text"
                      value={search.jobtitle}
                      onChange={(e) => setSearch({ ...search, jobtitle: e.target.value })}
                      placeholder="Job title, skills, or company"
                      className="w-full pl-11 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all placeholder-gray-500 font-medium"
                  />
              </div>
              <div className="relative flex-1">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                      type="text"
                      value={search.location}
                      onChange={(e) => setSearch({ ...search, location: e.target.value })}
                      placeholder="City, state, or remote"
                      className="w-full pl-11 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all placeholder-gray-500 font-medium"
                  />
              </div>
              <button
                  type="submit"
                  disabled={isloading}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 min-w-[140px]"
              >
                  {isloading ? <Loader className="animate-spin" size={20} /> : <>Search Jobs</>}
              </button>
          </form>
          {error && <p className="text-red-300 mt-3 text-center text-sm font-medium bg-red-900/30 py-2 px-4 rounded-lg inline-block mx-auto">{error}</p>}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 -mt-8 relative z-20 pb-12">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)] min-h-[600px]">
          
          {/* Left Column: Job List */}
          <div className="w-full lg:w-[400px] shrink-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full animate-fadeInUp">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FaBriefcase className="text-indigo-500" /> 
                {data && data.length > 0 ? `${data.length} Results Found` : 'Search Results'}
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {isloading ? (
                <div className="flex flex-col justify-center items-center h-full text-indigo-500 gap-3">
                  <Loader className="animate-spin" size={32} />
                  <span className="text-sm font-medium">Finding perfect matches...</span>
                </div>
              ) : data && data.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-center p-6 text-gray-500 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaSearch size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">No jobs found matching your criteria.</p>
                    <p className="text-sm mt-1">Try adjusting your keywords or location.</p>
                  </div>
                  <button 
                    onClick={() => { setSearch({jobtitle: "", location: ""}); setSearchParams({}); }}
                    className="text-indigo-600 font-medium text-sm hover:underline mt-2"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                data?.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => handleJobClick(job)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 relative overflow-hidden group ${
                      selectedJob?._id === job._id 
                      ? "bg-indigo-50 border-indigo-400 shadow-md" 
                      : "bg-white border-transparent hover:border-gray-200 hover:shadow-md border-b-gray-100 border-x-gray-50 border-t-gray-50"
                    }`}
                  >
                    {selectedJob?._id === job._id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                    )}
                    
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight pr-6 group-hover:text-indigo-600 transition-colors">
                        {job.jobtitle}
                      </h3>
                      {isJobSaved(job._id) && (
                        <FaStar className="text-yellow-400 shrink-0 absolute right-4 top-4" size={16} />
                      )}
                    </div>
                    
                    <div className="space-y-1.5 mb-3">
                      <p className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
                        <FaBuilding className="text-gray-400" size={12} /> {job.companyname}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-gray-400" size={12} /> {job.location}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="badge bg-green-100 text-green-700 py-1 px-2.5 text-xs font-bold rounded-lg flex items-center gap-1">
                        {job.salary}
                      </span>
                      <span className="badge bg-indigo-100 text-indigo-700 py-1 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1">
                        <FaClock size={10} /> {job.jobtype}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Job Details */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            {selectedJob ? (
              <div className="flex flex-col h-full">
                {/* Details Header (Sticky) */}
                <div className="p-8 border-b border-gray-100 bg-white shrink-0 relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FaBriefcase size={120} />
                  </div>
                  
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedJob.jobtitle}</h1>
                      <div className="flex items-center gap-2 text-lg text-indigo-600 font-semibold mb-4">
                        <FaBuilding /> {selectedJob.companyname}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSaveJobs(selectedJob?._id)}
                      className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                        isJobSaved(selectedJob._id)
                        ? "bg-yellow-50 border-yellow-200 text-yellow-500 hover:bg-yellow-100"
                        : "bg-white border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50"
                      }`}
                      title={isJobSaved(selectedJob._id) ? "Saved Job" : "Save this job"}
                    >
                      <FaStar size={20} className={isJobSaved(selectedJob._id) ? "fill-current" : ""} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3 w-fit border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <FaMapMarkerAlt size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Location</p>
                        <p className="font-bold text-gray-900 text-sm">{selectedJob.location}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3 w-fit border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <FaMoneyBillWave size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Salary</p>
                        <p className="font-bold text-gray-900 text-sm">{selectedJob.salary}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3 w-fit border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <FaClock size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Job Type</p>
                        <p className="font-bold text-gray-900 text-sm capitalize">{selectedJob.jobtype}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-gray-50/50">
                  <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                       Job Description
                    </h3>
                    <div className="prose max-w-none text-gray-600 leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      {selectedJob.description}
                    </div>
                  </section>

                  <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements & Details</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-500 mt-0.5"><FaBriefcase size={14}/></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Experience Required</p>
                          <p className="text-gray-600">{selectedJob.experienceRequired} Years</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-500 mt-0.5"><FaStar size={14}/></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Skills Required</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedJob?.skillsrequired?.map((skill, i) => (
                              <span key={i} className="badge bg-gray-100 text-gray-700 py-1 px-3 rounded-lg border border-gray-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-red-50 p-2 rounded-lg text-red-500 mt-0.5"><FaCalendarAlt size={14}/></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Application Deadline</p>
                          <p className="text-gray-600 font-medium">{new Date(selectedJob.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </li>
                    </ul>
                  </section>
                </div>

                {/* Bottom Action Bar (Sticky) */}
                <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex gap-4 md:flex-row flex-col">
                  <Link 
                    to={`/apply/${selectedJob._id}`} 
                    onClick={handleApply}
                    className="flex-1 btn-primary-gradient py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    <FaPaperPlane /> Apply Now
                  </Link>
                  <Link 
                    to={`/candidatequery/${selectedJob._id}`}
                    onClick={handleInquire}
                    className="flex-1 bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <FaInfoCircle /> Inquire About Job
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-gray-50/50">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6">
                  <FaBriefcase size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready for your next role?</h3>
                <p className="text-gray-500 max-w-md">Select a job from the list on the left to view detailed information, requirements, and apply directly.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}