import Navbar from "../Components/Navbar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchingJobs } from "../redux/slices/jobapplySlice";

export default function SearchJobs() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState({
    jobtitle: "",
    location: ""
  });
  const [error, setError] = useState(null);

  const { data, serverError } = useSelector((state) => state.jobapplying);
  console.log(data);
  console.log(serverError);

  function handleSubmit(e) {
    e.preventDefault();
    const { location, jobtitle } = search;
    if (!location && !jobtitle) {
      setError("Please provide at least one detail.");
      return;
    }
    
    // Dispatch the async action
    dispatch(
      searchingJobs({
        jobtitle: jobtitle.trim(),
        location: location.trim()
      })
    )
      .unwrap()
      .then(() => {
        setError(null); // Clear error if the search is successful
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data || "Something went wrong");
      });
  }

  return (
    <div>
      <Navbar />
      <h1>This is the search job component</h1>
      <form className="mt-5" onSubmit={handleSubmit}>
        <input
          type="search"
          value={search.jobtitle}
          className="border"
          onChange={(e) => setSearch({ ...search, jobtitle: e.target.value })}
          placeholder="Job title, keywords"
        />
        <input
          type="search"
          value={search.location}
          className="border"
          onChange={(e) => setSearch({ ...search, location: e.target.value })}
          placeholder="Location"
        />
        <button type="submit" className="border text-white bg-blue-500">
          Search
        </button>
      </form>

      {serverError && <span style={{ color: "red" }}>{serverError}</span>}
      {error && <span style={{ color: "red" }}>{error}</span>}

      <div>
        {data?.map((ele) => (
          <div className="border p-3 max-w-sm shadow-md rounded-lg border-blue-300 hover:border-blue-900 ml-16 mt-4" key={ele._id}>
            <h1 className="text-gray-900 font-bold">{ele.jobtitle}</h1>
            <h2 className="text-gray-600">{ele.companyname}</h2>
            <h2 className="text-gray-600">{ele.location}</h2>
            <p>
              <strong>Salary:</strong>{" "}
              <span className="text-green-500 font-bold bg-green-100">{ele.salary} per year</span>
            </p>
            <p>
              <strong>Job Type:</strong>{" "}
              <span className="text-green-500 font-bold bg-green-100">{ele.jobtype}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
