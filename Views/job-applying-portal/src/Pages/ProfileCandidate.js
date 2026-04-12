import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile, uploadProfilePicture, uploadResume } from "../redux/slices/profileSlice";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhoneAlt, FaGraduationCap, FaTools, FaCertificate, FaTrash, FaUpload, FaFileAlt, FaPlus, FaCheckCircle } from "react-icons/fa";

export default function ProfileCandidate() {
    const [profile, setProfile] = useState({
        profilePicture: "",
        mobile: "",
        education: [],
        skills: [],
        certification: [],
        resumeUpload: "",
    });

    const [profilePic, setProfilePic] = useState(null);
    const [resume, setResume] = useState(null);
    const [newSkill, setNewSkill] = useState({ skillName: "", experience: "" });
    const [newEducation, setNewEducation] = useState({ degree: "", startyear: "", endyear: "", institute: "", cgpa: "" });
    const [newCertification, setNewCertification] = useState({ certificationName: "", duration: { startMonth: "", endMonth: "" } });

    const dispatch = useDispatch();
    const id = localStorage.getItem("userId");

    const { data } = useSelector((state) => state.profile);
    console.log(data);
    
    const {user} = useSelector((state)=>state.users)
    console.log(user);
    
    console.log(data);
    const resumeDetails = data?.resumeUpload
    console.log(resumeDetails);
    
     
     
     useEffect(() => {
         dispatch(getProfile({ id }));
     }, [dispatch, id]);

    useEffect(() => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            ...data,
        }));
        
    }, [data]);

    function handleProfilePicChange(e) {
        setProfilePic(e.target.files[0]);
    }

    function handleFileChange(e) {

        
        setResume(e.target.files[0]);
    }

    function handleResumeUpload(e) {
        e.preventDefault();
        if (!resume) {
            toast.error("please select a file")
            return;
        }
    
        const formData = new FormData();
        formData.append("resume", resume);
    
        dispatch(uploadResume({ id: user._id, formData }))
            .unwrap()
            .then(() => {
               toast.success("resume successfully uploaded")
            })
            .catch(err => console.log(err));
    }
    

    const handleProfilePicUpload = async (e) => {
        e.preventDefault();
    
        if (!profilePic) {
           // alert("Please select a profile picture before uploading.");
            toast.error("Please select a profile picture before uploading.")
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("profilePicture", profilePic);
    
            await dispatch(uploadProfilePicture(formData)).unwrap();
            
           
            toast.success("successfully uploaded profile picture")
             dispatch(getProfile({ id })); 
        } catch (err) {
            console.error("Error uploading profile picture:", err);
            //alert("Failed to upload profile picture. Please try again.");
            toast.error("Failed to upload profile picture. Please try again")
        }
    };
    
    
    function handleAddSkill(e) {
        e.preventDefault();
        if (newSkill.skillName && newSkill.experience) {
            const updatedProfile = { ...profile, skills: [...profile.skills, newSkill] };
            setProfile(updatedProfile);
          dispatch(updateProfile({ id:user._id, profile: updatedProfile })).unwrap()
            setNewSkill({ skillName: "", experience: "" });
        } else {
            //alert("Please fill in both fields for the skill");
            toast.error("please fill in both fileds for the skill")
        }
       console.log(newSkill);
       
    }

    function handleAddEducation(e) {
        e.preventDefault();
        if (newEducation.degree && newEducation.startyear && newEducation.endyear && newEducation.institute) {
            const updatedProfile = { ...profile, education: [...profile.education, newEducation] };
            setProfile(updatedProfile);
             dispatch(updateProfile({ id:user._id, profile: updatedProfile }));
            setNewEducation({ degree: "", startyear: "", endyear: "", institute: "", cgpa: "" });
        }else{
            toast.error("please fill all the fields")
        }
    }

    function handleAddCertification(e) {
        e.preventDefault();
        if (newCertification.certificationName && newCertification.duration.startMonth && newCertification.duration.endMonth) {
            const updatedProfile = { ...profile, certification: [...profile.certification, newCertification] };
            setProfile(updatedProfile);
           dispatch(updateProfile({ id:user._id, profile: updatedProfile }));
            setNewCertification({ certificationName: "", duration: { startMonth: "", endMonth: "" } });
        }
        else{
            toast.error("please all the fields")
        }
    }

    function handleProfileUpdate(e) {
        e.preventDefault();
        console.log("id",id,profile);
        
        dispatch(updateProfile({ id:user._id, profile }));
    }

    function handleDeleteAndUpdate(type, index) {
        setProfile((prevProfile) => {
            const updatedData = prevProfile[type].filter((_, i) => i !== index);
            const updatedProfile = { ...prevProfile, [type]: updatedData };
           dispatch(updateProfile({ id:user._id, profile: updatedProfile }));
            return updatedProfile;
        });
    }

    function handleMobile(){  
        dispatch(updateProfile({id,profile}))
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 pt-10 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Candidate Dashboard</h1>
                    <p className="text-indigo-200 mt-2 text-lg">Manage your profile, skills, and experience to stand out to top recruiters.</p>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 -mt-12 relative z-20 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Profile Info & Assets */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center animate-fadeInUp">
                            <div className="p-6">
                                <div className="relative inline-block mt-2 mb-6">
                                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 mx-auto shadow-lg">
                                        <img 
                                            src={data?.profilePicture ? data?.profilePicture : "https://via.placeholder.com/150"} 
                                            alt="Profile" 
                                            className="w-full h-full rounded-full border-4 border-white object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-white rounded-full w-6 h-6"></div>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-gray-500 text-sm font-medium flex items-center justify-center gap-1.5 mt-1">
                                    <FaEnvelope /> {user?.email}
                                </p>

                                <form onSubmit={handleProfilePicUpload} encType="multipart/form-data" className="mt-6 border-t border-gray-100 pt-6 text-left">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Update Photo</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="file" 
                                            onChange={handleProfilePicChange} 
                                            className="flex-1 text-xs text-gray-500 file:border-0 file:bg-indigo-50 file:text-indigo-600 file:text-xs file:font-semibold file:px-3 file:py-2 file:rounded-lg hover:file:bg-indigo-100 transition" 
                                        />
                                        <button type="submit" className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1">
                                            <FaUpload /> Upload
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-4 border-t border-gray-100 pt-6 text-left">
                                     <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                     <div className="flex gap-2 relative">
                                        <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        <input 
                                            type="text" 
                                            value={profile.mobile} 
                                            onChange={(e) => setProfile({ ...profile, mobile: e.target.value })} 
                                            className="flex-1 border-2 border-gray-100 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition" 
                                            placeholder="+1 (555) 000-0000"
                                        />
                                        <button onClick={handleMobile} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition">
                                            Save
                                        </button>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Resume Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><FaFileAlt size={20} /></div>
                                <h3 className="text-lg font-bold text-gray-900">Resume Vault</h3>
                            </div>
                            
                            {resumeDetails && (
                                <a href={resumeDetails} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition group mb-4">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>Current Resume</span>
                                    <FaFileAlt className="ml-auto text-gray-400 group-hover:text-indigo-500" />
                                </a>
                            )}

                            <form onSubmit={handleResumeUpload} className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700">Upload New Document Form</label>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="w-full text-xs text-gray-500 file:w-full file:border-0 file:bg-gray-50 file:text-gray-700 file:text-sm file:font-semibold file:px-4 file:py-3 border-2 border-dashed border-gray-200 file:rounded-xl rounded-xl hover:file:bg-gray-100 transition cursor-pointer" 
                                    accept=".pdf,.doc,.docx"
                                />
                                <button type="submit" className="w-full btn-primary-gradient py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 mt-2">
                                    <FaUpload /> Upload Resume
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Interactive Arrays */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* SKILLS SECTION */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-fadeInUp" style={{animationDelay: '0.15s'}}>
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><FaTools size={20} /></div>
                                <h3 className="text-xl font-bold text-gray-900">Professional Skills</h3>
                            </div>
                            
                            {/* Skills List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {profile?.skills?.map((skill, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors group">
                                        <div>
                                            <p className="font-bold text-gray-900">{skill.skillName}</p>
                                            <p className="text-xs font-semibold text-blue-600 bg-blue-100 py-0.5 px-2 rounded-md inline-block mt-1">{skill.experience} Yrs Experience</p>
                                        </div>
                                        <button onClick={() => handleDeleteAndUpdate("skills", index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Skill Form */}
                            <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl flex flex-col sm:flex-row gap-3">
                                <input type="text" placeholder="Skill (e.g. React.js)" value={newSkill.skillName} onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })} className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition" />
                                <input type="number" placeholder="Years EXP" value={newSkill.experience} onChange={(e) => setNewSkill({ ...newSkill, experience: e.target.value })} className="w-full sm:w-32 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition" />
                                <button onClick={handleAddSkill} className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition flex justify-center items-center gap-2">
                                    <FaPlus /> Add
                                </button>
                            </div>
                        </div>

                        {/* EDUCATION SECTION */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><FaGraduationCap size={22} /></div>
                                <h3 className="text-xl font-bold text-gray-900">Education History</h3>
                            </div>
                            
                            {/* Education List */}
                            <div className="space-y-4 mb-6">
                                {profile?.education?.map((edu, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors group">
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{edu.degree}</p>
                                            <p className="text-sm font-medium text-gray-700">{edu.institute}</p>
                                            <p className="text-xs font-semibold text-emerald-700 bg-emerald-100 py-0.5 px-2 rounded-md inline-block mt-2">
                                                {edu.startyear} - {edu.endyear}
                                            </p>
                                        </div>
                                        <button onClick={() => handleDeleteAndUpdate("education", index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Education Form */}
                            <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl space-y-4">
                                <p className="text-sm font-bold text-gray-700 mb-1">Add Education Record</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" placeholder="Degree (e.g. B.Tech)" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition" />
                                    <input type="text" placeholder="Institute / University" value={newEducation.institute} onChange={(e) => setNewEducation({ ...newEducation, institute: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input type="text" placeholder="Start Year" value={newEducation.startyear} onChange={(e) => setNewEducation({ ...newEducation, startyear: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition" />
                                    <input type="text" placeholder="End Year" value={newEducation.endyear} onChange={(e) => setNewEducation({ ...newEducation, endyear: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition" />
                                    <button onClick={handleAddEducation} className="w-full bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition flex justify-center items-center gap-2">
                                        <FaPlus /> Save Record
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CERTIFICATION SECTION */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-fadeInUp" style={{animationDelay: '0.25s'}}>
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><FaCertificate size={20} /></div>
                                <h3 className="text-xl font-bold text-gray-900">Licenses & Certifications</h3>
                            </div>
                            
                            {/* Cert List */}
                            <div className="space-y-4 mb-6">
                                {profile?.certification?.map((cert, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-amber-300 transition-colors group">
                                        <div>
                                            <p className="font-bold text-gray-900 border-b-2 border-amber-200 inline-block mb-2">{cert.certificationName}</p>
                                            <div>
                                                <span className="text-xs font-semibold text-amber-800 bg-amber-100 py-1 px-2.5 rounded-lg">
                                                    Issued: {cert.duration.startMonth} — Valid Till: {cert.duration.endMonth}
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteAndUpdate("certification", index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Cert Form */}
                            <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl space-y-4">
                                <p className="text-sm font-bold text-gray-700 mb-1">Add Certification</p>
                                <input type="text" placeholder="Certification Name (e.g. AWS Solutions Architect)" value={newCertification.certificationName} onChange={(e) => setNewCertification({ ...newCertification, certificationName: e.target.value })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition" />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input type="text" placeholder="Issue Date (MM/YY)" value={newCertification.duration.startMonth} onChange={(e) => setNewCertification({ ...newCertification, duration: { ...newCertification.duration, startMonth: e.target.value } })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition" />
                                    <input type="text" placeholder="Expiration (MM/YY)" value={newCertification.duration.endMonth} onChange={(e) => setNewCertification({ ...newCertification, duration: { ...newCertification.duration, endMonth: e.target.value } })} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition" />
                                    <button onClick={handleAddCertification} className="w-full bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition flex justify-center items-center gap-2">
                                        <FaPlus /> Save License
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}