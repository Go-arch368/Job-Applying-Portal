import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendQuery, getQuery } from "../redux/slices/supportSlice";
import Navbar from "../Components/Navbar";

export default function CandidateQuery() {
  const dispatch = useDispatch();
  const { jobId } = useParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(getQuery({jobId}));
  }, [dispatch]);

  const { data } = useSelector((state) => state.support);
  console.log("Data received:", data);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(sendQuery({ jobId, query })).unwrap()
  
  .then(() => dispatch(getQuery({ jobId })));

    setQuery(""); // Clear the query after submission
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Candidate Query Portal</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your query here..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
          >
            Send Query
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-4">Your Queries</h2>
        {Array.isArray(data) && data.length === 0 ? (
          <p className="text-gray-500">No queries yet. Start by sending one!</p>
        ) : Array.isArray(data) ? (
          data.map((ele) => (
            <div
              key={ele._id}
              className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <p className="text-gray-700"><strong>Query:</strong> {ele.query}</p>
              {ele.response && (
                <p className="text-green-600 mt-2"><strong>Response:</strong> {ele.response}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-red-500">Error loading queries.</p>
        )}
      </div>
    </div>
  );
}
