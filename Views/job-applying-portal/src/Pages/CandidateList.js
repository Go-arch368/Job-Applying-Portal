import { useParams ,useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCandidates, validateCandidates } from "../redux/slices/jobapplySlice";
import Navbar from "../Components/Navbar";

export default function CandidateList() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  console.log(jobId);
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(getCandidates({ jobId }));
  }, []);

  const { data } = useSelector((state) => state.jobapplying);
  console.log(data);

  function handleAction(id, status) {
    console.log(id, status);
    dispatch(validateCandidates({ id, status }));
  }

  function handleInterview(){
     navigate("/jobdetails")
  }

  function goBack() {
    navigate(-1); // Goes to the previous page
}

  return (
    <div>
    <Navbar />
  
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
     
      <button onClick={goBack} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Go Back
      </button>
  
    
      <h1 className="text-2xl font-semibold text-center mb-4">Candidate List</h1>
  
      {data.length > 0 ? (
        data.map((ele, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-300"
          >
         
            <h2 className="text-lg font-semibold text-gray-800">{ele.user?.name}</h2>
            <p className="text-gray-600">{ele.user?.email}</p>
  
            <h3 className="mt-4 font-semibold">Resume</h3>
            {ele.resumeUrl ? (
              <a href={ele.resumeUrl} download className="text-blue-500 underline">
                Download Resume
              </a>
            ) : (
              <p className="text-gray-500">No resume uploaded</p>
            )}
  
           
            <h3 className="mt-4 font-semibold">Answered Questions</h3>
            {ele?.answeredQuestions?.length > 0 ? (
              ele.answeredQuestions.map((q, qIndex) => (
                <p key={qIndex} className="text-gray-700">
                  {q.questionText}: {q.startingTimestamp}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No answered questions</p>
            )}
  
            {ele.videoUrl && (
              <div className="mt-4 flex justify-center">
                <video controls width="500" height="150" className="rounded-lg shadow">
                  <source src={ele.videoUrl} type="video/webm" />
                </video>
              </div>
            )}
  
         
            <h3 className="mt-4 font-semibold">Actions</h3>
            {ele.status === "pending" ? (
              <div className="flex gap-4 mt-2 justify-center">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                  onClick={() => handleAction(ele._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                  onClick={() => handleAction(ele._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            ) : (
              <p className="mt-2 text-lg font-semibold">
                Status:{" "}
                <span className={ele.status === "accepted" ? "text-green-600" : "text-red-600"}>
                  {ele.status}
                </span>
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No candidates found</p>
      )}
  

      {data.length > 0 && (
        <div className="flex justify-center mt-4">
          <button onClick={handleInterview} className="bg-orange-600 text-white p-2 rounded-xl">
            Schedule Interview
          </button>
        </div>
      )}
    </div>
  </div>
  
  );
}
