import Navbar from "../Components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getRecruiters, updateVerificationStatus ,deleteRecruiter} from "../redux/slices/adminVerifySlice";

export default function VerifyingRecruiters() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.adminVerify);

  useEffect(() => {
    dispatch(getRecruiters());
  }, [dispatch]);

  function handleClick(ele) {
    const verify = window.confirm("Are you Sure your want to verify?")
    if(verify){
        dispatch(updateVerificationStatus({ _id: ele._id, isVerified: true }))
      .then(()=>dispatch(getRecruiters()))
    }
  }

  function handleDelete(ele){
    const deleting = window.confirm("Are you sure to delete the document")
    if(deleting){
        dispatch(deleteRecruiter({_id:ele._id}))
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
    <Navbar />
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-700">Recruiters Verifying Portal</h1>
      <div className="space-y-4">
        {data?.length !== 0 &&
          data.map((ele) => (
            <div key={ele._id} className="flex flex-col bg-gray-50 rounded-lg shadow-md p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Email</span>
                  <span>{ele.userId?.email || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Company</span>
                  <span>{ele.companyname || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Location</span>
                  <span>{ele.location || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Website</span>
                  <span>{ele.website || "N/A"}</span>
                </div>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-gray-600">Description</span>
                <p>{ele.description || "N/A"}</p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="border p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={() => handleClick(ele)}
                >
                  Verify
                </button>
            
                <button 
                  className="border p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300" 
                  onClick={() => handleDelete(ele)}
                >
                  Delete
                </button> 
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
  
  );
}


