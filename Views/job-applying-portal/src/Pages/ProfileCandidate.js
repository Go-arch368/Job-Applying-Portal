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
        resumeUpload: [],
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
    const resumeDetails = data.resumeUpload? data.resumeUpload?.filepath : "";
     
     
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
        dispatch(uploadResume({resume}))
    }

    function handleProfilePicUpload(e) {
        e.preventDefault();
        if (!profilePic) return;
        dispatch(uploadProfilePicture({profilePic}))
    }

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
            <h1>Update Candidate Profile</h1>

            <img src={profile.profilePicture?profile.profilePicture:"default-profile.png"} alt="Profile" width="150" height="150" className="rounded-full border-2 flex justify-center " />

            <form onSubmit={handleProfilePicUpload} encType="multipart/form-data">
                <label>Upload Profile Picture:</label>
                <input type="file" onChange={handleProfilePicChange} />
                <button type="submit">Upload Picture</button>
            </form>

           

            <form onSubmit={handleProfileUpdate}>
                <label>Mobile:</label>
                <input type="text" value={profile.mobile} onChange={(e) => setProfile({ ...profile, mobile: e.target.value })} />

                <h3>Skills</h3>
                {profile?.skills?.map((skill, index) => (
                    <div key={index}>
                        <p>Skill Name: {skill.skillName} Experience: {skill.experience}</p>
                        <button onClick={() => handleDeleteAndUpdate("skills", index)}>Delete</button>
                    </div>
                ))}
                <label>Add Skill</label>
                <input type="text" placeholder="add skill" value={newSkill.skillName} onChange={(e)=>setNewSkill({...newSkill,skillName:e.target.value})}/>
                <input type="number" placeholder="Experience in years" value={newSkill.experience} onChange={(e)=>setNewSkill({...newSkill,experience:e.target.value})} />
                <button onClick={handleAddSkill}>Add Skill</button>
                
                <h3>Education</h3>
                {profile?.education?.map((edu, index) => (
                    <div key={index}>
                        <p>Degree: {edu.degree} Start Year: {edu.startyear} End Year: {edu.endyear} Institute: {edu.institute}</p>
                        <button onClick={() => handleDeleteAndUpdate("education", index)}>Delete</button>
                    </div>
                ))}
                <input type="text" placeholder="Degree" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
                <input type="text" placeholder="Start Year" value={newEducation.startyear} onChange={(e) => setNewEducation({ ...newEducation, startyear: e.target.value })} />
                <input type="text" placeholder="End Year" value={newEducation.endyear} onChange={(e) => setNewEducation({ ...newEducation, endyear: e.target.value })} />
                <input type="text" placeholder="Institute" value={newEducation.institute} onChange={(e) => setNewEducation({ ...newEducation, institute: e.target.value })} />
                <button onClick={handleAddEducation}>Add Education</button>

                <h3>Certification</h3>
                {profile?.certification?.map((cert, index) => (
                    <div key={index}>
                        <p>{cert.certificationName} {cert.duration.startMonth} - {cert.duration.endMonth}</p>
                        <button onClick={() => handleDeleteAndUpdate("certification", index)}>Delete</button>
                    </div>
                ))}
                <input type="text" placeholder="Certification Name" value={newCertification.certificationName} onChange={(e) => setNewCertification({ ...newCertification, certificationName: e.target.value })} />
                <input type="text" placeholder="Start Month" value={newCertification.duration.startMonth} onChange={(e) => setNewCertification({ ...newCertification, duration: { ...newCertification.duration, startMonth: e.target.value } })} />
                <input type="text" placeholder="End Month" value={newCertification.duration.endMonth} onChange={(e) => setNewCertification({ ...newCertification, duration: { ...newCertification.duration, endMonth: e.target.value } })} />
                <button onClick={handleAddCertification}>Add Certification</button>
                
                <button type="submit">Update Profile</button>
            </form>
           
            {resumeDetails ? (
                <iframe 
                    src={resumeDetails} 
                    width="100%" 
                    height="500px" 
                    style={{ border: "none" }}
                    title="Resume"
                ></iframe>
            ) : (
                <p>No resume uploaded</p>
            )}

            <form onSubmit={handleResumeUpload}>
              <label> Resume</label>
              <input type="file" onChange={handleFileChange}></input>
              <button>Upload Resume</button>
             </form>
        </div>
    );
}
