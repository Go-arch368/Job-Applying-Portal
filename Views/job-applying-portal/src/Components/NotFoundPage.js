import { Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function NotFoundPage(){
    const navigate = useNavigate()

function handleNotFound(){
    localStorage.removeItem("token")
    navigate("/")
}
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-2xl text-gray-800 mt-4">Page Not Found</p>
        <p className="text-gray-600 mt-2">The page you’re looking for doesn’t exist or has been moved.</p>
        <button onClick={handleNotFound}>
        <Link to="/" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Go Back Home
        </Link>
        </button>
      
      </div>
    )
}

