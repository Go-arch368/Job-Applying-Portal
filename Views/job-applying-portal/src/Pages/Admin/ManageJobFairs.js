import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAll, jobFaireditId, deleteEvent } from "../../redux/slices/jobFairSlice";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function ManageJobFair() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  const { data } = useSelector((state) => state.jobFair);
  const today = new Date();

  function handleEdit(id) {
    console.log(id);
    dispatch(jobFaireditId(id));
    navigate("/createjobFair");
  }

  function handleDelete(id) {
    console.log(id);
    const confirm = window.confirm("Are you Sure?");
    if (confirm) {
      dispatch(deleteEvent({ id }));
    }
  }

  function handlePrevPage() {
    navigate(-1);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Previous Page Button */}
      <div className="mb-6">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          onClick={handlePrevPage}
        >
          Previous Page
        </button>
      </div>

      {/* Job Fair Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? (
          data.map((ele) => {
            const jobDate = new Date(ele.date);
            const isExpired = jobDate < today;

            return (
              <div
                key={ele._id}
                className={`p-6 bg-white border border-gray-200 rounded-xl shadow-lg transition duration-300 ${
                  isExpired ? "opacity-50 grayscale bg-gray-50" : "hover:shadow-xl"
                }`}
              >
                {/* Job Fair Name */}
                <h1 className="text-xl font-bold text-gray-800 mb-2">{ele.name}</h1>

                {/* Job Fair Description */}
                <p className="text-gray-600 mb-4">{ele.description}</p>

                {/* Job Fair Details */}
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Date:</span> {format(jobDate, "yyyy-MM-dd")}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span> {ele.location}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {isExpired ? (
                      <span className="text-red-500 font-semibold">Expired</span>
                    ) : (
                      <span className="text-green-500 font-semibold">Active</span>
                    )}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-4">
                  <button
                    className={`flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ${
                      isExpired ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleEdit(ele._id)}
                    disabled={isExpired}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    onClick={() => handleDelete(ele._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">No job fairs available</p>
        )}
      </div>
    </div>
  );
}