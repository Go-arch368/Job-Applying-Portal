import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { recruiterData } from "../redux/slices/recruiterSlice";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaMapMarkerAlt, FaGlobe, FaAlignLeft, FaTimes } from "react-icons/fa";

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
     
      try {
        dispatch(recruiterData({ recruiterDetails, resetForm, navigate })).unwrap()
        toast.success("Details submitted to admin")
      } catch(err) {
        toast.error("Submit failed")
      }

      onclose()
      resetForm();
    }
  }

  if (!showRecruiterForm) return null; 

  return (
    <div className="relative">
      <button
        type="button"
        className="absolute -top-4 -right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
        onClick={onclose}
      >
        <FaTimes size={18} />
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaBuilding className="text-2xl text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Company Details</h1>
        <p className="text-gray-500 mt-2 text-sm z-10 relative">Tell us about your company to attract the best talent.</p>
      </div>

      <form onSubmit={handleRecruiterSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Company Name</label>
          <div className="relative">
            <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={recruiterDetails.companyname}
              className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white hover:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${recruiterErrors.companyname ? 'border-red-300 ring-4 ring-red-500/10 focus:border-red-500' : ''}`}
              onChange={(e) => setRecruiterDetails({ ...recruiterDetails, companyname: e.target.value })}
            />
          </div>
          {recruiterErrors.companyname && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{recruiterErrors.companyname}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Location</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. New York, NY"
              value={recruiterDetails.location}
              className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white hover:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${recruiterErrors.location ? 'border-red-300 ring-4 ring-red-500/10 focus:border-red-500' : ''}`}
              onChange={(e) => setRecruiterDetails({ ...recruiterDetails, location: e.target.value })}
            />
          </div>
          {recruiterErrors.location && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{recruiterErrors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Website URL</label>
          <div className="relative">
            <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="https://acmecorp.com"
              value={recruiterDetails.website}
              className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white hover:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 ${recruiterErrors.website ? 'border-red-300 ring-4 ring-red-500/10 focus:border-red-500' : ''}`}
              onChange={(e) => setRecruiterDetails({ ...recruiterDetails, website: e.target.value })}
            />
          </div>
          {recruiterErrors.website && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{recruiterErrors.website}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Company Description</label>
          <div className="relative">
            <FaAlignLeft className="absolute left-4 top-4 text-gray-400" />
            <textarea
              placeholder="What makes your company a great place to work?"
              value={recruiterDetails.description}
              className={`w-full border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white hover:bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 h-32 resize-none ${recruiterErrors.description ? 'border-red-300 ring-4 ring-red-500/10 focus:border-red-500' : ''}`}
              onChange={(e) => setRecruiterDetails({ ...recruiterDetails, description: e.target.value })}
            ></textarea>
          </div>
          {recruiterErrors.description && <p className="text-red-500 text-xs font-medium ml-1 mt-1">{recruiterErrors.description}</p>}
        </div>

        <button
          type="submit"
          className="w-full btn-primary-gradient py-3.5 rounded-xl text-sm font-bold mt-4 hover:shadow-lg flex justify-center items-center"
        >
          Submit Recruiter Profile
        </button>
      </form>
    </div>
  );
}
