import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { userRole, profileUpdate } from "../redux/slices/usersSlice";
import CreatableSelect from "react-select/creatable";
import { FiUpload } from "react-icons/fi";

export default function ProfileAdmin() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const [data, setData] = useState({
    profile: "",
    name: "",
    email: "",
    mobile: "",
    responsibilities: [],
  });
  const [edit, setEdit] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null); // Store image preview

  useEffect(() => {
    dispatch(userRole());
  }, [dispatch]);

  function handleEdit() {
    if (user) {
      setData({ ...user, responsibilities: user.responsibilities || [] });
      setProfilePreview(user.profile); // Set existing profile image
      setEdit(true);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, profile: file });
      setProfilePreview(URL.createObjectURL(file)); // Show preview
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEdit(false);
    const formData = new FormData();
    formData.append("mobile", data.mobile);
    formData.append("profile", data.profile);
    data.responsibilities.forEach((resp, index) => {
      formData.append(`responsibilities[${index}]`, resp);
    });

    dispatch(profileUpdate(formData));
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-6">
        {/* Profile View (Hidden when Editing) */}
        {!edit && (
          <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-[600px] flex flex-col items-center">
            <img
              src={user?.profile || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg"
            />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-gray-600 font-medium">📞 {user?.mobile}</p>
            <p className="text-gray-700 bg-gray-100 px-4 py-2 rounded-md mt-2">
              📝 {user?.responsibilities?.join(", ")}
            </p>

            <button
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md shadow-md text-md font-semibold hover:bg-blue-700 transition"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* Edit Form (Shows only when editing) */}
        {edit && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl p-5 w-full max-w-[450px] flex flex-col space-y-3"
          >
            {/* Profile Upload (Fixed Preview) */}
            <div className="flex items-center justify-center relative">
              <img
                src={profilePreview || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md"
              />
              <button
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full shadow-md hover:bg-blue-600"
                onClick={() => document.getElementById("fileUpload").click()}
                type="button"
              >
                <FiUpload size={18} />
              </button>
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <label className="text-md font-medium text-gray-700">Mobile</label>
            <input
              type="text"
              value={data.mobile}
              onChange={(e) => setData({ ...data, mobile: e.target.value })}
              className="p-2 border rounded-md w-full"
            />

            <label className="text-md font-medium text-gray-700">Responsibilities</label>
            <CreatableSelect
              isMulti
              value={data.responsibilities.map((res) => ({ value: res, label: res }))}
              onChange={(selectedOptions) =>
                setData({
                  ...data,
                  responsibilities: selectedOptions.map((option) => option.value),
                })
              }
              className="w-full"
            />

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md text-md font-semibold hover:bg-gray-500 transition"
                onClick={() => setEdit(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md text-md font-semibold hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
