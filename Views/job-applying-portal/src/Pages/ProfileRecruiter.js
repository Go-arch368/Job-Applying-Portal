import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { recruiterProfile,updateRecruiterFile,updateRecruiterUpload} from "../redux/slices/recruiterSlice";
// import CreateableSelect from "react-select/creatable"
import CreatableSelect from 'react-select/creatable';


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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Recruiter Profile
        </h1>

        {edit && (
            <>
          <form className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Edit Profile</h2>
        
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Username:</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.userId.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
        
            <div>
              <label className="block text-gray-700 font-medium">Email:</label>
              <input
                type="email"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.userId.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
        
            <div>
              <label className="block text-gray-700 font-medium">Company Name:</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.companyname}
                onChange={(e) => setData({ ...data, companyname: e.target.value })}
              />
            </div>
        
            <div>
              <label className="block text-gray-700 font-medium">Location:</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
              />
            </div>
        
            <div>
              <label className="block text-gray-700 font-medium">Website:</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.website}
                onChange={(e) => setData({ ...data, website: e.target.value })}
              />
            </div>
        
            <div>
              <label className="block text-gray-700 font-medium">Role:</label>
              {/* <select
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
              >
                <option value="">Select</option>
                {roleTypes.map((ele, i) => (
                  <option value={ele} key={i}>
                    {ele}
                  </option>
                ))}
              </select> */}
            <CreatableSelect
                options={options}
                id="role"
                onChange={handleSelect}
                className="w-full"
                value={selectedRole}
                isMulti // Allow multiple role selection
                />

            </div>
        
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </form>
        
     
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Upload Profile Image</h2>
        
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Profile Image:</label>
              <input
                type="file"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setData({ ...data, companyLogo: e.target.files[0] })}
              />
            </div>
        
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            >
              Upload Profile
            </button>
          </div>
        </form>
        
</>
        )}

        {profileData ? (
          <div className="flex bg-white shadow-lg rounded-lg p-6">
            <div className="w-1/3 flex flex-col items-center border-r border-gray-300 pr-6">
              <img
                src={profileData?.companyLogo || "default-profile.png"}
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-800">{profileData?.userId?.name}</h2>
              <p className="text-gray-600">{profileData?.userId?.email}</p>
            </div>
            <div className="w-2/3 pl-6 space-y-3">
              <p><span className="font-semibold text-gray-800">Location:</span> {profileData.location}</p>
              <p><span className="font-semibold text-gray-800">Companyname:</span> {profileData.companyname}</p>
              <p >
  <span className="font-semibold text-gray-800">Role:</span> 
  <div className="flex flex-wrap gap-2 justify-center">

  {Array.isArray(profileData.role) ? 
    profileData.role.map((ele, index) => (
        <p className="bg-blue-100 text-blue-700 p-1 rounded-lg" key={index}>{ele}</p>
    )) 
    : <p className="bg-blue-100 text-blue-700">{profileData.role}</p>}
    </div>

</p>
 
              <p>
                <span className="font-semibold text-gray-800">Website:</span>{" "}
                <a href={profileData.website} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                  {profileData.website}
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-800 ">Jobs Posted:</span>{" "}
                <div className="flex gap-2">
                {profileData?.jobPosted?.length ? (
                  profileData.jobPosted.map((ele, index) => (
                    <span key={index} className="text-blue-700 bg-blue-50 rounded-lg p-0">
                      {ele.jobtitle}
                      
                    </span>
                  ))

                ) : (
                  "No jobs posted"
                )}
                </div>
              </p>

              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <h2 className="text-center text-gray-600 text-xl">Loading...</h2>
        )}
      </div>
    </div>
  );
}
