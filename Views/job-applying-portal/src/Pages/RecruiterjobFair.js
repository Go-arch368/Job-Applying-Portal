import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../redux/slices/jobFairSlice";
import Navbar from "../Components/Navbar";
import { format } from "date-fns";
import { recruiterRegister,displayRegistered } from "../redux/slices/jobFairSlice";

export default function RecruiterjobFair() {
  const dispatch = useDispatch();
  const [register, setRegister] = useState(false);
  const [recruiterRegistered,setRecruiterRegistered] = useState(false)
  const [role, setRole] = useState("");
  const [clientErrors,setClientErrors] = useState({})
  const [id,setId] = useState("")
  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  const { data,recRegister,registeredAll } = useSelector((state) => state.jobFair);
  console.log(data);
  console.log(recRegister)
  console.log(registeredAll)

  function handleRegister(ele) {
       setRegister(true);
       setId(ele._id)
       console.log(ele._id);
  }

  function handleRecruiterRegistered(id){
     console.log(id)
     setRecruiterRegistered(true)
     dispatch(displayRegistered({id}))
  }

  function handleSubmit(){
    let errors={}
    if(!role.trim()){
        errors.role="role should not be empty"
    }
   if(Object.keys(errors).length!==0){
    setClientErrors(errors)
   }else{
    setClientErrors({})
    dispatch(recruiterRegister({id,role})).unwrap()
    try{
       alert("successfully registered")
       setRole("")
    }
    catch(err){
        console.log(err)
    }
   }
  }

  return (
    <div className="bg-gray-100 relative">
      <Navbar />

      {/* Dimming effect when register is true */}
      {(register||recruiterRegistered) && (
        <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
      )}

      <div className={`grid grid-cols-2 gap-4 p-10 ${register ? "opacity-20 pointer-events-none" : ""}`}>
        {data.length > 0 ? (
          data.map((ele) => (
            <div key={ele._id} className="p-4 border rounded-lg shadow bg-white">
              <h1 className="font-bold text-lg">Name: {ele.name}</h1>
              <h2 className="text-gray-700">Description: {ele.description}</h2>
              <h2 className="text-gray-700">
                Date: {format(ele.date, "yyyy-MM-dd")}
              </h2>
              <h2 className="text-gray-700">Location: {ele.location}</h2>
              <h3>
                Status: {new Date(ele.date) < new Date() ? "Expired" : <p className="text-green-500 inline">{ele.status}</p>}
              </h3>

              <div className="mt-4 flex gap-2 justify-center">
                <button
                  className="border bg-orange-400 text-white px-4 py-1 rounded"
                  onClick={() => handleRegister(ele)}
                >
                  Register
                </button>
                <button className="border bg-red-500 text-white px-4 py-1 rounded" onClick={()=>handleRecruiterRegistered(ele._id)}>
                  Recruiters Registered
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No job fairs available</p>
        )}
      </div>

      {/* Modal Form when register is true */}
      {register && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-center text-lg font-bold mb-4">Register</h2>
            <div>
              <label className="block text-gray-700 font-medium">Role:</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {clientErrors&&<p style={{color:"red"}}>{clientErrors.role}</p>}
              {/* {recRegister&&<p style={{color:"green"}}>{recRegister.message}</p>} */}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                onClick={() => setRegister(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        {recruiterRegistered && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-center text-lg font-bold mb-4">Recruiters Registered</h2>
            {registeredAll.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">S.no</th>
                    <th className="border border-gray-300 px-4 py-2">Company Name</th>
                    <th className="border border-gray-300 px-4 py-2">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {registeredAll.map((ele, index) => (
                    <tr key={index} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2">{ele.companyname}</td>
                        <td className="border border-gray-300 px-4 py-2">{ele.role}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500">No registered recruiters found</p>
            )}

            <div className="mt-4 flex justify-center">
                <button
                onClick={() => setRecruiterRegistered(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                Close
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}
