import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent, updateEvent } from "../../redux/slices/jobFairSlice";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function CreateJobFair() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });

  const { editId } = useSelector((state) => state.jobFair);
  const [clientError, setClientError] = useState({});
  const { data, serverError } = useSelector((state) => state.jobFair);

  useEffect(() => {
    if (editId) {
      const editIdData = data.find((ele) => ele._id === editId);
      if (editIdData) {
        const changingDate = editIdData.date ? format(new Date(editIdData.date), "yyyy-MM-dd") : "";
        setFormData({
          name: editIdData.name,
          date: changingDate,
          location: editIdData.location,
          description: editIdData.description,
        });
      }
    }
  }, [editId, data]);

  function validation() {
    let errors = {};
    if (!formData.name.trim()) {
      errors.name = "The name field is required";
    }
    if (!formData.date.trim()) {
      errors.date = "The date field is required";
    }
    if (!formData.location.trim()) {
      errors.location = "The location field is required";
    }
    if (!formData.description.trim()) {
      errors.description = "The description field is required";
    }
    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    let errors = validation();
    if (Object.keys(errors).length !== 0) {
      setClientError(errors);
    } else {
      setClientError({});
      if (editId) {
        dispatch(updateEvent({ formData, editId, navigate }));
      } else {
        dispatch(createEvent({ formData })).unwrap()
          .then(() => {
            alert("Successfully created");
            setFormData({
              name: "",
              date: "",
              location: "",
              description: "",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {editId ? "Edit Job Fair" : "Create Job Fair"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Fair Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Fair Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {clientError.name && <p className="text-red-500 text-sm mt-1">{clientError.name}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {clientError.date && <p className="text-red-500 text-sm mt-1">{clientError.date}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {clientError.location && (
              <p className="text-red-500 text-sm mt-1">{clientError.location}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            {clientError.description && (
              <p className="text-red-500 text-sm mt-1">{clientError.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editId ? "Update Job Fair" : "Create Job Fair"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}