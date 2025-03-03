import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function UnauthorizedPage() {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  function handleHome() {
    localStorage.removeItem("token"); // Clear token first
    navigate("/"); // Then navigate
  }

  return (
    <div className="flex items-center justify-center mt-20 bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      <div className="text-center p-8 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-2xl max-w-lg w-full border border-gray-300 dark:border-gray-700">
        <h1 className="text-5xl font-bold text-red-600 dark:text-red-400 mb-4">
          🚧 401 Unauthorized
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-400 mb-6">
          Oops! Looks like you took a wrong turn. <br />
          This page is off-limits! 🚫🙅‍♂️
        </p>
        <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-6">
          "I could let you in... but then I’d have to delete your cookies 🍪"
        </p>

        {/* Only show this if user exists */}
        {/* {user && (
          <div className="flex justify-center gap-4">
            <a
              href={user.role === "admin" ? "/admin" : "/emp"}
              className="px-6 py-3 bg-violet-500 dark:bg-violet-700 text-white text-lg font-semibold rounded-lg hover:bg-violet-600 dark:hover:bg-violet-800 transition"
            >
              🔙 Go Back Home
            </a>
          </div>
        )} */}

        <button
          onClick={handleHome}
          className="px-6 py-3 mt-4 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
