import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAll, jobFaireditId, deleteEvent } from "../../redux/slices/jobFairSlice";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {data.length > 0 ? (
          data.map((ele) => {
            const jobDate = new Date(ele.date);
            const isExpired = jobDate < today;

            return (
              <div
                key={ele._id}
                className={`p-4 border rounded-lg shadow transition duration-300 ${
                  isExpired ? "opacity-50 grayscale bg-gray-100" : "bg-white"
                }`}
              >
                <h1 className="font-bold text-lg">Name: {ele.name}</h1>
                <h2 className="text-gray-700">Description: {ele.description}</h2>
                <h2 className="text-gray-700">Date: {format(jobDate, "yyyy-MM-dd")}</h2>
                <h2 className="text-gray-700">Location: {ele.location}</h2>
                <h3>
                  Status:{" "}
                  {isExpired ? (
                    <span className="text-red-500 font-semibold">Expired</span>
                  ) : (
                    <span className="text-green-500">{ele.status}</span>
                  )}
                </h3>

                <div className="mt-4 flex gap-2 justify-center">
                  <button
                    className="border bg-orange-400 text-white px-4 py-1 rounded disabled:opacity-50"
                    onClick={() => handleEdit(ele._id)}
                    disabled={isExpired}
                  >
                    Edit
                  </button>
                  <button
                    className="border bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => handleDelete(ele._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No job fairs available</p>
        )}
      </div>
    </div>
  );
}
