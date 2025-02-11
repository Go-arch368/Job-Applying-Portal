import { useEffect,useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProfile } from "../redux/slices/profileSlice"
import Navbar from "../Components/Navbar"
export default function ProfileCandidate(){
    const [profile,setProfile] = useState({
        profilePicture:"",
        mobile:"",
        education:[],
        skills:[],
        certification:[],
        resumeUpload:[],
    })
    const [profilePic,setProfilePic] = useState(null)
     const dispatch = useDispatch()
     const id = localStorage.getItem("userId")
     console.log(id)
     useEffect(()=>{
        dispatch(getProfile({id})).unwrap()
     },[dispatch,id]) 
     useEffect(()=>{
        if(data){
            setProfile(data)
        }
     })
    const {data} = useSelector((state)=>state.profile)
    
    function handleProfilePicChange(e){
        setProfilePic(e.target.files[0])
    }

    function  handleFileChange(e){
        setResume(e.target.files[0]);
      };

    function handleResumeUpload(e){
       dispatch()
    }
    

    function handleProfilePicUpload(e){
         dispatch()
    }

    function handleProfileUpdate(e){
          e.preventDefault()
          dispatch(updateProfile({id,profile}))
    }

    function handleDeleteAndUpdate(type,index){
         let updatedData;
         if(type=="education"){
            updatedData = profile.education.filter((_,i)=>i!==index)
            setProfile({...profile,education:updatedData})
         }else if(type=="skills"){
            updatedData = profile.skills.filter((_,i)=>i!==index)
            setProfile({...profile,skills:updatedData})
         }else if(type=="certification"){
            updatedData = profile.certification.filter((_,i)=>i!==index)
            setProfile({...profile,certification:updatedData})
         }
         else if(type=="resume"){
            updatedData = profile.resumeUpload.filter((_,i)=>i!=index)
            setProfile({...profile,resumeUpload:updatedData})
         }
    }

    return(
        <div>
            <Navbar/>
           <h1>Update candidate Profile</h1>
         <form onSubmit={handleProfilePicUpload} encType="multipart/form-data">
            <label>Upload Profile Picture:</label>
            <input type="file" onChange={handleProfilePicChange}/>
            <button type="submit">Upload Picture</button>
         </form>
         <form onSubmit={handleProfileUpdate}>
            <label>Mobile:</label>
            <input type="text" value={profile.mobile} onChange={(e)=>setProfile({...profile,mobile:e.target.value})}/>
            <h3>Education</h3>
            {profile?.education?.map((edu,index)=>(
                 <div key={index}>
                      <p> Degree:{edu.degree} startYear:{edu.startyear} endYear:{edu.endyear} institute:{edu.institute}</p>
                      <button onClick={()=>handleDeleteAndUpdate("education",index)}>Delete</button>
                 </div>
            ))}
            <h3>Skills</h3>
            {profile.skills.map((skill,index)=>(
                <div key={index}>
                   <p>skillName:{skill.skillName} experience:{skill.skillName}</p>
                   <button onClick={()=>handleDeleteAndUpdate("skills",index)}></button>
                </div>
            ))}
            <h3>Certification</h3>
            {profile.certification.map((cert,index)=>(
                <div key={index}>
                    <p>{cert.certificationName} {cert.duration.startMonth} {cert.duration.endMonth}</p>
                    <button onClick={()=>handleDeleteAndUpdate("certification",index)}>Delete</button>
                </div>
            ))}
            <button type="submit">Update Profile</button>
         </form>

        <form onSubmit={handleResumeUpload} encType="multipart/form-data">
           <label>Upload Resume:</label>  
           <input type="file" onChange={handleFileChange}/> 
           <button type="submit">Upload Resume</button>
        </form>

        <h3>Uploaded Resumes</h3>
      {profile.resumeUpload.map((resume, index) => (
        <div key={index}>
          <p>{resume.filename}</p>
          <button onClick={() => handleDeleteAndUpdate("resume", index)}>Delete</button>
        </div>
      ))}

     </div>
    )
}