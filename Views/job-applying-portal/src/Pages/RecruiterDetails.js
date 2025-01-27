import { useEffect, useState } from "react";
import validator from "validator";
import { useDispatch,useSelector } from "react-redux";
import { recruiterData } from "../redux/slices/recruiterSlice";
import { useNavigate } from "react-router-dom";

export default function RecruiterDetails({ userData }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
  const [recruiterDetails, setRecruiterDetails] = useState({
    email: "",
    companyname: "",
    location: "",
    website: "",
    description: "",
  });

  useEffect(()=>{
    if(userData&&userData.email){
        setRecruiterDetails((prev)=>({
            ...prev,email:userData.email
        }))
    }
  },[userData])

  function handleInputChange(e){
      const {name,value} = e.target
      setRecruiterDetails((prevDetails)=>({
        ...prevDetails,
        [name]:value
      }))
  }

  const [recruiterErrors, setRecruiterErrors] = useState({}); // Initialize as an empty object

  let errors = {};
  function ValidateRecruiterForm() {
    if (!recruiterDetails.email.trim()) {
      errors.email = "Email field is required";
    } else if (!validator.isEmail(recruiterDetails.email)) {
      errors.email = "Email field should be in a valid format";
    }
    if (!recruiterDetails.companyname.trim()) {
      errors.companyname = "The company name field is required";
    }
    if (!recruiterDetails.location.trim()) {
      errors.location = "The location field is required";
    }
    if (!recruiterDetails.website.trim()) {
      errors.website = "The website field is required";
    }
    if (!recruiterDetails.description.trim()) {
      errors.description = "The description field is required";
    } else if (recruiterDetails.description.trim().length <= 10) {
      errors.description = "The description field should be greater than 10 characters";
    }
  
  }

  function resetForm(){
    setRecruiterDetails({
        email: "",
        companyname: "",
        location: "",
        website: "",
        description: "",  
    })
  }


  function handleRecruiterSubmit(e) {
    e.preventDefault();
    ValidateRecruiterForm(); 

    if (Object.keys(errors).length !== 0) {
        setRecruiterErrors(errors)
        
    }else{
        setRecruiterErrors({})
        console.log(recruiterDetails)
        dispatch(recruiterData({recruiterDetails,resetForm}))
         navigate("/login")
    }
  }

  return (
    <div>
      <h1>Recruiter Details</h1>
      <form onSubmit={handleRecruiterSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={recruiterDetails.email}
            name="email"
            className="border"
            onChange={handleInputChange}
            disabled
          />
          {recruiterErrors.email && (
            <span style={{ color: "red" }}>{recruiterErrors.email}</span>
          )}
        </div>
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            value={recruiterDetails.companyname}
            className="border"
            onChange={(e) =>
              setRecruiterDetails({
                ...recruiterDetails,
                companyname: e.target.value,
              })
            }
          />
          {recruiterErrors.companyname && (
            <span style={{ color: "red" }}>{recruiterErrors.companyname}</span>
          )}
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={recruiterDetails.location}
            className="border"
            onChange={(e) =>
              setRecruiterDetails({
                ...recruiterDetails,
                location: e.target.value,
              })
            }
          />
          {recruiterErrors.location && (
            <span style={{ color: "red" }}>{recruiterErrors.location}</span>
          )}
        </div>
        <div>
          <label>Website:</label>
          <input
            type="text"
            value={recruiterDetails.website}
            className="border"
            onChange={(e) =>
              setRecruiterDetails({
                ...recruiterDetails,
                website: e.target.value,
              })
            }
          />
          {recruiterErrors.website && (
            <span style={{ color: "red" }}>{recruiterErrors.website}</span>
          )}
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={recruiterDetails.description}
            className="border"
            onChange={(e) =>
              setRecruiterDetails({
                ...recruiterDetails,
                description: e.target.value,
              })
            }
          ></textarea>
          {recruiterErrors.description && (
            <span style={{ color: "red" }}>{recruiterErrors.description}</span>
          )}
        </div>
        <div>
          <button className="border bg-blue-500 text-white p-2">
            Send to Admin
          </button>
        </div>
      </form>
    </div>
  );
}
