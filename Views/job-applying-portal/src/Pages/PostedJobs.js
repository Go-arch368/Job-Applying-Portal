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

function handlePost(){
  navigate("/jobposting")
}


  return (
    <div className="bg-gray-100 min-h-screen">
    <Navbar />
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-6">Posted Jobs</h1>

      {data?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {data.map((ele, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
            >
              <h2 className="text-2xl font-bold text-gray-900">{ele.companyname}</h2>
              <p className="text-lg text-blue-500 font-medium">{ele.jobtitle}</p>
              <p className="text-gray-600 text-sm mt-2">{ele.description}</p>

              <div className="mt-4 space-y-2">
                <p className="text-gray-700"><strong>Type:</strong> {ele.jobtype}</p>
                <p className="text-gray-700"><strong>Location:</strong> {ele.location}</p>
                <p className="text-gray-700"><strong>Salary:</strong> <span className="text-green-500 font-bold">{ele.salary}</span></p>
                <p className="text-gray-700"><strong>Experience:</strong> {ele.experienceRequired}</p>
                <p className="text-gray-700"><strong>Deadline:</strong> <span className="text-red-500">{ele.deadline}</span></p>
              </div>

              {ele.skillsrequired?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-800">Skills:</h3>
                  <ul className="flex flex-wrap gap-2 mt-2">
                    {ele.skillsrequired.map((skill, i) => (
                      <div
                        key={`skill-${index}-${i}`}
                        className="bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded-full flex justify-center"
                      >
                        {skill}
                      </div>
                    ))}
                  </ul>
                </div>
              )}

{ele.assignedQuestions?.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-800">Assigned Questions:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-2">
                    {ele.assignedQuestions.map((question, i) => (
                      <div key={`question-${index}-${i}`} className="text-gray-700 text-sm">
                        {question}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 mt-4">No assigned questions available.</p>
              )}

              <div className="flex justify-between mt-6">
                <Link to={`/candidateList/${ele._id}`} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700">Candidate List</Link>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => { dispatch(setEditJobId(ele._id)); navigate('/jobposting'); }}
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
      ) : (
        <div className="text-center mt-20">
          <h2 className="text-2xl text-gray-700">No jobs have been posted yet.</h2>
          <button
            onClick={handlePost}
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
          >
            Post a Job
          </button>
        </div>
      )}
    </div>
  </div>
);
}
