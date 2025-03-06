import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { recruiterqueries, responsePost } from "../redux/slices/supportSlice";

export default function Recruiterquery() {
  const dispatch = useDispatch();
  const [responses, setResponses] = useState({});
  const [expandedJobTitles, setExpandedJobTitles] = useState({}); // Track expanded/collapsed state

  // Fetch recruiter queries on component mount
  useEffect(() => {
    dispatch(recruiterqueries());
  }, [dispatch]);

  const { recruiterquery } = useSelector((state) => state.support);

  // Handle form submission for responding to a query
  async function handleSubmit(e, id) {
    e.preventDefault();
    const response = responses[id];
    if (response) {
      await dispatch(responsePost({ id, response }));
      dispatch(recruiterqueries()); // Refresh the queries after submitting a response
      setResponses((prev) => ({ ...prev, [id]: "" })); // Clear the response input
    }
  }

  // Handle changes in the response textarea
  function handleChange(e, id) {
    const { value } = e.target;
    setResponses((prev) => ({ ...prev, [id]: value }));
  }

  // Group queries by job title
  const groupedQueries = recruiterquery?.reduce((acc, query) => {
    const jobTitle = query.jobId.jobtitle;
    if (!acc[jobTitle]) acc[jobTitle] = [];
    acc[jobTitle].push(query);
    return acc;
  }, {});

  // Toggle expanded/collapsed state for a job title
  const toggleJobTitle = (jobTitle) => {
    setExpandedJobTitles((prev) => ({
      ...prev,
      [jobTitle]: !prev[jobTitle], // Toggle the state
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Recruiter Queries</h1>

        {/* Grouped Queries by Job Title */}
        {Object.keys(groupedQueries).map((jobTitle) => (
          <div key={jobTitle} className="mb-6">
            {/* Job Title (Clickable Header) */}
            <div
              onClick={() => toggleJobTitle(jobTitle)}
              className="cursor-pointer bg-white shadow-lg rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-semibold text-blue-600">{jobTitle}</h2>
              <span className="text-gray-500">
                {expandedJobTitles[jobTitle] ? "▲" : "▼"} {/* Arrow indicator */}
              </span>
            </div>

            {/* Queries for the Job Title (Conditionally Rendered) */}
            {expandedJobTitles[jobTitle] && (
              <div className="mt-4">
                {groupedQueries[jobTitle].map((ele) => (
                  <div key={ele._id} className="bg-white shadow-md rounded-lg p-6 mb-4">
                    {/* Query */}
                    <p className="text-gray-700 font-medium">Query:</p>
                    <p className="text-gray-600 mt-1">{ele.query}</p>

                    {/* Response or Response Form */}
                    {ele.response ? (
                      <div className="mt-4">
                        <p className="text-green-600 font-medium">Response:</p>
                        <p className="text-green-500 mt-1">{ele.response}</p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleSubmit(e, ele._id)} className="mt-4">
                        <label className="block text-gray-700 font-medium mb-2">Response</label>
                        <textarea
                          value={responses[ele._id] || ""}
                          onChange={(e) => handleChange(e, ele._id)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          rows="3"
                          placeholder="Type your response here..."
                        ></textarea>
                        <button
                          type="submit"
                          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                          Submit Response
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}