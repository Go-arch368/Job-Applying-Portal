import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccepted } from "../redux/slices/jobapplySlice";
import Navbar from "./Navbar";
import { acceptInterview } from "../redux/slices/jobpostingSlice";

export default function AcceptedCandidates() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    location: "",
    mode: "",
  });
  const [clientErrors, setClientErrors] = useState({});

  function validation() {
    let errors = {};
    if (!form.date.trim()) {
      errors.date = "Date should be filled";
    } else if (new Date(form.date) < new Date()) {
      errors.date = "Date should be greater than today";
    }
    if (!form.time.trim()) {
      errors.time = "Time should not be empty";
    }
    if (!form.location.trim()) {
      errors.location = "Location should not be empty";
    }
    if (!form.mode.trim()) {
      errors.mode = "Mode should not be empty";
    }
    return errors;
  }

  const dispatch = useDispatch();
  const { jobId } = useParams();
  const { accepted, serverError } = useSelector((state) => state.jobapplying);
  const { scheduling } = useSelector((state) => state.jobposting);

  useEffect(() => {
    dispatch(getAccepted({ jobId }));
  }, []);

  function handleInterview() {
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errors = validation();
    if (Object.keys(errors).length !== 0) {
      setClientErrors(errors);
    } else {
      setClientErrors({});
      dispatch(acceptInterview({ jobId, form })).unwrap();
      alert("Interview details successfully sent");
    }
  }

  const modeOptions = ["Online", "Offline"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Accepted Candidates</h1>

        {accepted.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accepted.map((ele) => (
                <div key={ele.applicantId._id} className="bg-white p-4 shadow-md rounded-lg border border-gray-300">
                  <h2 className="text-lg font-semibold">Username: {ele.applicantId.name}</h2>
                  <p className="text-gray-600">Email: {ele.applicantId.email}</p>
                  <p className={`text-sm font-medium ${ele.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {ele.status}
                  </p>
                </div>
              ))}
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-6"
              onClick={handleInterview}
            >
              Schedule Interview
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white p-6 mt-4 shadow-md rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                    {clientErrors.date && <span className="text-red-500 text-sm">{clientErrors.date}</span>}
                  </div>

                  <div>
                    <label className="block font-medium">Time</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                    {clientErrors.time && <span className="text-red-500 text-sm">{clientErrors.time}</span>}
                  </div>

                  <div>
                    <label className="block font-medium">Location</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                    {clientErrors.location && <span className="text-red-500 text-sm">{clientErrors.location}</span>}
                  </div>

                  <div>
                    <label className="block font-medium">Mode</label>
                    <select
                      value={form.mode}
                      onChange={(e) => setForm({ ...form, mode: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Select</option>
                      {modeOptions.map((ele) => (
                        <option key={ele} value={ele}>
                          {ele}
                        </option>
                      ))}
                    </select>
                    {clientErrors.mode && <span className="text-red-500 text-sm">{clientErrors.mode}</span>}
                  </div>
                </div>

                <div className="mt-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Send Details
                  </button>
                  {scheduling && <span className="text-red-500 text-sm ml-2">{scheduling}</span>}
                </div>
              </form>
            )}
          </>
        ) : (
          <p className="text-red-500 text-center">{serverError}</p>
        )}
      </div>
    </div>
  );
}
    