import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { recruiterProfile, updateRecruiterFile, updateRecruiterUpload } from "../redux/slices/recruiterSlice";
import CreatableSelect from 'react-select/creatable';
import { FaBuilding, FaMapMarkerAlt, FaGlobe, FaBriefcase, FaUserTie, FaEdit, FaUpload, FaSave, FaEnvelope, FaImage } from "react-icons/fa";


export default function ProfileRecruiter() {
  const dispatch = useDispatch();
  const id = localStorage.getItem("userId");
  const [selectedRole,setSelectedRole] = useState([])
  useEffect(() => {
    dispatch(recruiterProfile({ id }));
  }, [dispatch, id]);

  const { profileData } = useSelector((state) => state.recruiter);
  console.log(profileData)
  const [data, setData] = useState({
    name: "",
    email: "",
    companyname: "",
    location: "",
    website: "",
    jobposted: "",
    role:[],
    companyLogo: "",
  });

  const [edit, setEdit] = useState(false);
  const roleTypes = ["HR", "Hiring Manager", "Recruiter"];
  const options = roleTypes.map((ele)=>({value:ele,label:ele}))
  console.log(options);
  
  function handleEdit(e) {
    if (profileData) {
      setData({ ...profileData });
      setEdit(true);
    }
  }

  function handleSave(e){
    e.preventDefault()
     setEdit(false) 
     console.log(data)
    dispatch(updateRecruiterFile({data,id}))
  }

  function handleFormSubmit(e){
      e.preventDefault()
      setEdit(false)
      const formData = new FormData()
      formData.append("companyLogo",data.companyLogo)

      dispatch(updateRecruiterUpload({formData,id}))

  }

  const handleSelect = (selectedOption) => {
    setSelectedRole(selectedOption || []); 

    setData((prev) => ({
      ...prev,
      role: selectedOption ? selectedOption.map((ele) => ele.value) : [],
    }));
  };
  console.log(data)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 pt-10 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Recruiter Command Center</h1>
            <p className="text-blue-200 mt-2 text-lg">Manage your company presence and active job postings from one central hub.</p>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 -mt-12 relative z-20 pb-16">
        
        {edit ? (
            /* ================= EDIT MODE ================= */
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-4xl mx-auto animate-fadeInUp">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><FaEdit size={22} /></div>
                    <h3 className="text-2xl font-bold text-gray-900">Edit Company Profile</h3>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700">Account Username</label>
                            <input type="text" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition" value={data.userId.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700">Account Email</label>
                            <input type="email" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition" value={data.userId.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700">Company Name</label>
                            <input type="text" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition" value={data.companyname} onChange={(e) => setData({ ...data, companyname: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700">HQ Location</label>
                            <input type="text" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Company Website</label>
                            <input type="text" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition" value={data.website} onChange={(e) => setData({ ...data, website: e.target.value })} />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Recruiter Roles</label>
                            <CreatableSelect
                                options={options}
                                onChange={handleSelect}
                                className="w-full text-sm"
                                value={selectedRole}
                                isMulti
                                styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      borderWidth: '2px',
                                      borderColor: state.isFocused ? '#6366f1' : '#e5e7eb',
                                      borderRadius: '0.75rem',
                                      padding: '0.2rem',
                                      boxShadow: state.isFocused ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none',
                                      "&:hover": { borderColor: '#d1d5db' }
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button type="submit" onClick={handleSave} className="flex-1 btn-primary-gradient py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition flex justify-center items-center gap-2">
                            <FaSave /> Save Target Changes
                        </button>
                        <button type="button" onClick={() => setEdit(false)} className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition">
                            Cancel
                        </button>
                    </div>
                </form>

                <div className="mt-10 border-t-2 border-dashed border-gray-200 pt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><FaImage size={22} /></div>
                        <h3 className="text-xl font-bold text-gray-900">Brand Identity (Logo)</h3>
                    </div>
                    
                    <form onSubmit={handleFormSubmit} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                        <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 w-full md:w-auto" onChange={(e) => setData({ ...data, companyLogo: e.target.files[0] })} />
                        <button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition ml-auto flex justify-center items-center gap-2">
                            <FaUpload /> Process Upload
                        </button>
                    </form>
                </div>
            </div>
        ) : (
            /* ================= VIEW MODE ================= */
            profileData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Company Identity Left Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center p-8 animate-fadeInUp">
                            <div className="w-32 h-32 rounded-3xl bg-white border-4 border-gray-100 shadow-md flex items-center justify-center mx-auto mb-6 p-2 object-contain overflow-hidden">
                                <img
                                    src={profileData?.companyLogo || "default-profile.png"}
                                    alt="Company Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{profileData?.companyname || "Unnamed Company"}</h2>
                            <p className="text-gray-500 text-sm font-medium mb-6 flex justify-center items-center gap-2">
                                <FaBuilding /> Enterprise Account
                            </p>

                            <div className="space-y-3 text-left bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-sm border-b border-gray-200 pb-2"><FaUserTie className="inline text-gray-400 mr-2" /> <span className="font-semibold text-gray-700">{profileData?.userId?.name}</span></p>
                                <p className="text-sm border-b border-gray-200 pb-2"><FaEnvelope className="inline text-gray-400 mr-2" /> <span className="font-semibold text-gray-700">{profileData?.userId?.email}</span></p>
                                <p className="text-sm pb-1 flex items-start"><FaMapMarkerAlt className="inline text-gray-400 mr-2 mt-1 shrink-0" /> <span className="font-semibold text-gray-700 break-words">{profileData.location || "Location not set"}</span></p>
                            </div>

                            <button onClick={handleEdit} className="w-full mt-6 bg-white border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 text-indigo-600 font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2">
                                <FaEdit /> Configure Details
                            </button>
                        </div>
                    </div>

                    {/* Operational Details Right Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                            
                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                                    <div className="flex items-center gap-3 text-blue-600 font-bold mb-2">
                                        <FaGlobe size={18} /> Company Portal
                                    </div>
                                    {profileData.website ? (
                                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 text-sm font-semibold hover:text-blue-600 hover:underline break-all">
                                            {profileData.website}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Not configured</span>
                                    )}
                                </div>
                                <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                                    <div className="flex items-center gap-3 text-purple-600 font-bold mb-2">
                                        <FaUserTie size={18} /> Current Roles
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(profileData.role) && profileData.role.length > 0 ? (
                                            profileData.role.map((ele, index) => (
                                                <span className="bg-white border text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm" key={index}>{ele}</span>
                                            )) 
                                        ) : (
                                            profileData.role ? <span className="bg-white border text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">{profileData.role}</span> : <span className="text-gray-400 text-sm">None assigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Live Job Postings */}
                            <div className="border-t border-gray-100 pt-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><FaBriefcase size={20} /></div>
                                        <h3 className="text-xl font-bold text-gray-900">Active Job Postings</h3>
                                    </div>
                                    <div className="badge bg-gray-100 text-gray-600 font-bold py-1 px-3 rounded-xl border border-gray-200">
                                        {profileData?.jobPosted?.length || 0} Total
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {profileData?.jobPosted?.length ? (
                                        profileData.jobPosted.map((ele, index) => (
                                            <div key={index} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition group cursor-pointer">
                                                <p className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition">{ele.jobtitle}</p>
                                                <FaMapMarkerAlt className="text-gray-300 group-hover:text-emerald-500 transition" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8">
                                            <FaBriefcase className="mx-auto text-gray-300 mb-3" size={32} />
                                            <p className="text-gray-500 font-medium">No job postings currently active.</p>
                                            <p className="text-sm text-gray-400 mt-1">Visit your dashboard to launch a new requisition.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <h2 className="text-gray-600 font-medium text-lg">Loading Enterprise Profile...</h2>
                </div>
            )
        )}
      </div>
    </div>
  );
}
