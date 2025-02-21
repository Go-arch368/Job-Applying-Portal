import Navbar from "../Components/Navbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate ,Link} from "react-router-dom";
import { displayJobs, setEditJobId ,deletingJob} from "../redux/slices/jobpostingSlice";


export default function PostedJobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.jobposting);

  useEffect(() => {
    dispatch(displayJobs());
  }, [dispatch]);

function handleDelete(id){
   const confirm = window.confirm("Are you sure to delete this")
    if(confirm){
        dispatch(deletingJob({id})).unwrap()
         .then(()=>{
            dispatch(displayJobs())
         })
    }
} 



  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 my-6">
          Posted Jobs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data?.map((ele, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all"
            >
          
              <h2 className="text-xl font-semibold text-gray-900">
                {ele.companyname}
              </h2>
              <p className="text-gray-700 text-lg">{ele.jobtitle}</p>
              <p className="text-gray-600 text-sm">{ele.description}</p>

      
              <div className="mt-3 space-y-1">
                <p className="text-gray-700">
                  <strong>Type:</strong>{" "}
                  <span className="text-blue-500">{ele.jobtype}</span>
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong>{" "}
                  <span className="text-blue-500">{ele.location}</span>
                </p>
                <p className="text-gray-700">
                  <strong>Salary:</strong>{" "}
                  <span className="text-green-500 font-bold">{ele.salary}</span>
                </p>
                <p className="text-gray-700">
                  <strong>Experience:</strong>{" "}
                  <span className="text-gray-500">{ele.experienceRequired}</span>
                </p>
                <p className="text-gray-700">
                  <strong>Deadline:</strong>{" "}
                  <span className="text-red-500">{ele.deadline}</span>
                </p>
              </div>

          
              {ele?.skillsrequired?.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-gray-700 font-medium">Skills:</h3>
                  <ul className="flex flex-wrap gap-2 mt-1">
                    {ele?.skillsrequired?.map((el, i) => (
                      <li
                        key={`skill-${index}-${i}`}
                        className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full"
                      >
                        {el}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ele.assignedQuestions?.length > 0 ? (
                <div className="mt-3">
                  <h3 className="text-gray-700 font-medium">Assigned Questions:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {ele.assignedQuestions.map((el, i) => (
                      <li key={`question-${index}-${i}`}>{el}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No assigned questions</p>
              )}

        
              <div className="flex justify-between mt-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700" ><Link to={`/candidateList/${ele._id}`}>CandidateList</Link></button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => {  dispatch(setEditJobId(ele._id));
                    navigate("/jobposting");
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={() => handleDelete(ele._id)}
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
