import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { recruiterqueries, responsePost } from "../redux/slices/supportSlice";

export default function Recruiterquery() {
  const dispatch = useDispatch();
  const [responses, setResponses] = useState({});

  useEffect(() => {
    dispatch(recruiterqueries());
  }, [dispatch]);

  const { recruiterquery } = useSelector((state) => state.support);
  console.log(recruiterquery);

  async function handleSubmit(e, id) {
    e.preventDefault();
    const response = responses[id];
    if (response) {
      await dispatch(responsePost({ id, response }));
      dispatch(recruiterqueries());
      setResponses((prev) => ({ ...prev, [id]: "" }));
    }
  }

  function handleChange(e, id) {
    const { value } = e.target;
    setResponses((prev) => ({ ...prev, [id]: value }));
  }

  // Grouping queries by job title
  const groupedQueries = recruiterquery?.reduce((acc, query) => {
    const jobTitle = query.jobId.jobtitle;
    if (!acc[jobTitle]) acc[jobTitle] = [];
    acc[jobTitle].push(query);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Recruiter Queries</h1>
        {Object.keys(groupedQueries).map((jobTitle) => (
          <div key={jobTitle} className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">{jobTitle}</h2>
            {groupedQueries[jobTitle].map((ele) => (
              <div key={ele._id} className="bg-white shadow-lg rounded-lg p-6 mb-4">
                <p className="text-gray-700">Query: {ele.query}</p>
                {ele.response ? (
                  <p className="text-green-600 mt-2">Response: {ele.response}</p>
                ) : (
                  <form onSubmit={(e) => handleSubmit(e, ele._id)} className="mt-4">
                    <label className="block text-gray-700 font-medium">Response</label>
                    <textarea
                      value={responses[ele._id] || ""}
                      onChange={(e) => handleChange(e, ele._id)}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows="3"
                    ></textarea>
                    <button
                      type="submit"
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
