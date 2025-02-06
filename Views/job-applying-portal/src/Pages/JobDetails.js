import { useDispatch,useSelector } from "react-redux"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { displayJobs } from "../redux/slices/jobpostingSlice"
import Navbar from "../Components/Navbar"
export default function JobDetails(){
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(displayJobs())
   },[])
    const {data} = useSelector((state)=>state.jobposting)
    console.log(data)
    return(
        <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Total Job Postings</h1>
        {data?.length > 0 ? (
          data.map((ele) => (
            <div key={ele._id} className="bg-gray-50 p-4 mb-4 rounded-lg shadow">
              <h2 className="text-xl font-medium text-gray-700">{ele.jobtitle}</h2>
              <div className="mt-3">
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 mr-2" >
                <Link to={`/accepted/${ele._id}`}> Accepted </Link> 
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200">
                 <Link to={`/rejected/${ele._id}`}>Rejected</Link> 
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No job postings found.</p>
        )}
      </div>
    </div>
    )
}