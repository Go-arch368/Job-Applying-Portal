import Navbar from "../Components/Navbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { displayJobs, setEditJobId, deletingJob } from "../redux/slices/jobpostingSlice";

export default function PostedJobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.jobposting);

  useEffect(() => {
    dispatch(displayJobs());
  }, [dispatch]);

  function handleDelete(id) {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (confirm) {
      dispatch(deletingJob({ id })).unwrap().then(() => {
        dispatch(displayJobs());
      });
    }
  }

  function handlePost() {
    navigate("/jobposting");
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Posted Jobs</h1>

        {/* Job Cards Grid (2 Columns) */}
        {data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
            {data.map((ele, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between w-full max-w-md text-center"
              >
                {/* Job Details */}
                <div>
                  {/* Company Name and Job Title */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{ele.companyname}</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {ele.jobtype}
                    </span>
                  </div>
                  <p className="text-lg text-blue-600 font-medium mt-2">{ele.jobtitle}</p>

                  {/* Job Description */}
                  <p className="text-gray-600 text-sm mt-2">{ele.description}</p>

                  {/* Job Details */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-center">
                      <span className="text-gray-700 font-medium w-24">Location:</span>
                      <span className="text-gray-600">{ele.location}</span>
                    </div>
                    <div className="flex justify-center">
                      <span className="text-gray-700 font-medium w-24">Salary:</span>
                      <span className="text-green-600 font-bold">{ele.salary}</span>
                    </div>
                    <div className="flex justify-center">
                      <span className="text-gray-700 font-medium w-24">Experience:</span>
                      <span className="text-gray-600">{ele.experienceRequired}</span>
                    </div>
                    <div className="flex justify-center">
                      <span className="text-gray-700 font-medium w-24">Deadline:</span>
                      <span className="text-red-600">{ele.deadline}</span>
                    </div>
                  </div>

                  {/* Skills Required */}
                  {ele.skillsrequired?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Skills Required:</h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {ele.skillsrequired.map((skill, i) => (
                          <span
                            key={`skill-${index}-${i}`}
                            className="bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assigned Questions */}
                  {ele.assignedQuestions?.length > 0 ? (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Assigned Questions:</h3>
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
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
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-6">
                  <Link
                    to={`/candidateList/${ele._id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex-1 text-center mr-2"
                  >
                    Candidate List
                  </Link>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex-1 text-center mx-2"
                    onClick={() => {
                      dispatch(setEditJobId(ele._id));
                      navigate("/jobposting");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex-1 text-center ml-2"
                    onClick={() => handleDelete(ele._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Jobs Posted Yet */
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-2xl text-gray-700 mb-6">No jobs have been posted yet.</h2>
            <button
              onClick={handlePost}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition"
            >
              Post a Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}