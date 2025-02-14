import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile ,uploadProfilePicture,uploadResume} from "../redux/slices/profileSlice";
import Navbar from "../Components/Navbar";

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
    const resumeDetails = data?.resumeUpload
    console.log(resumeDetails);
    
     
     
    useEffect(() => {
        dispatch(getProfile({ id }));
    }, [dispatch, id]);

    useEffect(() => {
        if (data) {
            setProfile(data);
        }
    }, [data]);

    function handleProfilePicChange(e) {
        setProfilePic(e.target.files[0]);
    }

    function handleFileChange(e) {
        setResume(e.target.files[0]);
    }

    function handleResumeUpload(e) {
        e.preventDefault();
        if (!resume) return;
        dispatch(uploadResume({resume})).unwrap()
        try{
            alert("successfully uploaded resume")
        }
        catch(err){
            console.log(err)
        }
    }

    const handleProfilePicUpload = async (e) => {
        e.preventDefault();
        if (!profilePic) return;
    
        try {
            await dispatch(uploadProfilePicture({ profilePic })).unwrap();
            alert("Successfully uploaded profile picture");
        } catch (err) {
            console.error("Error uploading profile picture:", err.response);
        }
    };
    
    function handleAddSkill(e) {
        e.preventDefault();
        if (newSkill.skillName && newSkill.experience) {
            const updatedProfile = { ...profile, skills: [...profile.skills, newSkill] };
            setProfile(updatedProfile);
            dispatch(updateProfile({ id, profile: updatedProfile }));
            setNewSkill({ skillName: "", experience: "" });
        } else {
            alert("Please fill in both fields for the skill");
        }
    }

    function handleAddEducation(e) {
        e.preventDefault();
        if (newEducation.degree && newEducation.startyear && newEducation.endyear && newEducation.institute) {
            const updatedProfile = { ...profile, education: [...profile.education, newEducation] };
            setProfile(updatedProfile);
            dispatch(updateProfile({ id, profile: updatedProfile }));
            setNewEducation({ degree: "", startyear: "", endyear: "", institute: "", cgpa: "" });
        }
    }

    function handleAddCertification(e) {
        e.preventDefault();
        if (newCertification.certificationName && newCertification.duration.startMonth && newCertification.duration.endMonth) {
            const updatedProfile = { ...profile, certification: [...profile.certification, newCertification] };
            setProfile(updatedProfile);
            dispatch(updateProfile({ id, profile: updatedProfile }));
            setNewCertification({ certificationName: "", duration: { startMonth: "", endMonth: "" } });
        }
    }

    function handleProfileUpdate(e) {
        e.preventDefault();
        dispatch(updateProfile({ id, profile }));
    }

    function handleDeleteAndUpdate(type, index) {
        setProfile((prevProfile) => {
            const updatedData = prevProfile[type].filter((_, i) => i !== index);
            const updatedProfile = { ...prevProfile, [type]: updatedData };
            dispatch(updateProfile({ id, profile: updatedProfile }));
            return updatedProfile;
        });
    }

    return (  
        <div>  
         <Navbar />
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Update Candidate Profile</h1>

        <div className="flex flex-col items-center">
                <img 
                    src={profile?.profilePicture ? profile?.profilePicture : "default-profile.png"} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-2 mb-4"
                />

            <form onSubmit={handleProfilePicUpload} encType="multipart/form-data" className="space-y-4">
                <label className="block font-semibold">Upload Profile Picture:</label>
                <input type="file" onChange={handleProfilePicChange} className="border p-2 w-full rounded" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Upload Picture</button>
            </form>
        </div>

        <h2 className="text-lg font-semibold mt-6">Username: {data?.userId?.name}</h2>
        <h2 className="text-lg font-semibold">Email: {data?.userId?.email}</h2>

        <form onSubmit={handleProfileUpdate} className="space-y-4 mt-4">
            <label className="block font-semibold">Mobile:</label>
            <input type="text" value={profile.mobile} onChange={(e) => setProfile({ ...profile, mobile: e.target.value })} className="border p-2 w-full rounded" />

            <h3 className="text-lg font-semibold">Skills</h3>
            {profile?.skills?.map((skill, index) => (
                <div key={index} className="flex justify-between items-center border-b py-2">
                    <p>Skill Name: {skill.skillName} | Experience: {skill.experience}</p>
                    <button onClick={() => handleDeleteAndUpdate("skills", index)} className="text-red-500 hover:text-red-600">Delete</button>
                </div>
            ))}
            <input type="text" placeholder="Add Skill" value={newSkill.skillName} onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })} className="border p-2 w-full rounded" />
            <input type="number" placeholder="Experience in years" value={newSkill.experience} onChange={(e) => setNewSkill({ ...newSkill, experience: e.target.value })} className="border p-2 w-full rounded" />
            <button onClick={handleAddSkill} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Skill</button>

            <h3 className="text-lg font-semibold">Education</h3>
            {profile?.education?.map((edu, index) => (
                <div key={index} className="flex justify-between items-center border-b py-2">
                    <p>Degree: {edu.degree} | {edu.startyear} - {edu.endyear} | {edu.institute}</p>
                    <button onClick={() => handleDeleteAndUpdate("education", index)} className="text-red-500 hover:text-red-600">Delete</button>
                </div>
            ))}
            <input type="text" placeholder="Degree" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} className="border p-2 w-full rounded" />
            <input type="text" placeholder="Start Year" value={newEducation.startyear} onChange={(e) => setNewEducation({ ...newEducation, startyear: e.target.value })} className="border p-2 w-full rounded" />
            <input type="text" placeholder="End Year" value={newEducation.endyear} onChange={(e) => setNewEducation({ ...newEducation, endyear: e.target.value })} className="border p-2 w-full rounded" />
            <input type="text" placeholder="Institute" value={newEducation.institute} onChange={(e) => setNewEducation({ ...newEducation, institute: e.target.value })} className="border p-2 w-full rounded" />
            <button onClick={handleAddEducation} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Education</button>

            <h3 className="text-lg font-semibold">Certification</h3>
            {profile?.certification?.map((cert, index) => (
                <div key={index} className="flex justify-between items-center border-b py-2">
                    <p>{cert.certificationName} | {cert.duration.startMonth} - {cert.duration.endMonth}</p>
                    <button onClick={() => handleDeleteAndUpdate("certification", index)} className="text-red-500 hover:text-red-600">Delete</button>
                </div>
            ))}
            <input type="text" placeholder="Certification Name" value={newCertification.certificationName} onChange={(e) => setNewCertification({ ...newCertification, certificationName: e.target.value })} className="border p-2 w-full rounded" />
            <input type="text" placeholder="Start Month" value={newCertification.duration.startMonth} onChange={(e) => setNewCertification({ ...newCertification, duration: { ...newCertification.duration, startMonth: e.target.value } })} className="border p-2 w-full rounded" />
            <input type="text" placeholder="End Month" value={newCertification.duration.endMonth} onChange={(e) => setNewCertification({ ...newCertification, duration: { ...newCertification.duration, endMonth: e.target.value } })} className="border p-2 w-full rounded" />
            <button onClick={handleAddCertification} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Certification</button>
        </form>

        <a href={resumeDetails} className="text-blue-500 hover:underline block mt-4">Download Resume</a>

        <form onSubmit={handleResumeUpload} className="space-y-4 mt-4">
            <label className="block font-semibold">Upload Resume:</label>
            <input type="file" onChange={handleFileChange} className="border p-2 w-full rounded" />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Upload Resume</button>
        </form>
    </div>
    </div>
    );
}