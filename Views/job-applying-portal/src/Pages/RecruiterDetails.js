import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { recruiterData } from "../redux/slices/recruiterSlice";
import { useNavigate } from "react-router-dom";

export default function RecruiterDetails({ users, showRecruiterForm ,onclose}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [recruiterDetails, setRecruiterDetails] = useState({
    companyname: "",
    location: "",
    website: "",
    description: "",
  });

  const [recruiterErrors, setRecruiterErrors] = useState({});

  function ValidateRecruiterForm() {
    let errors = {};
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
    return errors;
  }

  function resetForm() {
    setRecruiterDetails({
      companyname: "",
      location: "",
      website: "",
      description: "",
    });
    setRecruiterErrors({});
  }

  function handleRecruiterSubmit(e) {
    e.preventDefault();
    const errors = ValidateRecruiterForm();

    if (Object.keys(errors).length !== 0) {
      setRecruiterErrors(errors);
    } else {
      setRecruiterErrors({});
     
      try{
        dispatch(recruiterData({ recruiterDetails, resetForm ,navigate})).unwrap()
        toast.success("Details submitted to admin")
      }
      catch(err){
       toast.error("Submit failed")
      }

      onclose()
      resetForm();
    }
  }

  function handleSendAdmin(){
     navigate("/")
  }

  if (!showRecruiterForm) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onclose}
        >
          ✖
        </button>
        <h1 className="text-lg font-semibold text-center mb-4">Recruiter Details</h1>
        <form onSubmit={handleRecruiterSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium">Company Name:</label>
            <input
              type="text"
              value={recruiterDetails.companyname}
              className="w-full border p-2 rounded-md text-xs focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setRecruiterDetails({ ...recruiterDetails, companyname: e.target.value })
              }
            />
            {recruiterErrors.companyname && (
              <p className="text-red-500 text-xs mt-1">{recruiterErrors.companyname}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium">Location:</label>
            <input
              type="text"
              value={recruiterDetails.location}
              className="w-full border p-2 rounded-md text-xs focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setRecruiterDetails({ ...recruiterDetails, location: e.target.value })
              }
            />
            {recruiterErrors.location && (
              <p className="text-red-500 text-xs mt-1">{recruiterErrors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium">Website:</label>
            <input
              type="text"
              value={recruiterDetails.website}
              className="w-full border p-2 rounded-md text-xs focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setRecruiterDetails({ ...recruiterDetails, website: e.target.value })
              }
            />
            {recruiterErrors.website && (
              <p className="text-red-500 text-xs mt-1">{recruiterErrors.website}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium">Description:</label>
            <textarea
              value={recruiterDetails.description}
              className="w-full border p-2 rounded-md text-xs h-16 resize-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setRecruiterDetails({ ...recruiterDetails, description: e.target.value })
              }
            ></textarea>
            {recruiterErrors.description && (
              <p className="text-red-500 text-xs mt-1">{recruiterErrors.description}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium p-2 rounded-md transition"
              onSubmit={handleSendAdmin}
            >
              Send to Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
