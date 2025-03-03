import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchingJobs ,saveJobs,withOutSearch,getSaved} from "../redux/slices/jobapplySlice";
import { countJobClick } from "../redux/slices/jobpostingSlice";
import { Link,useSearchParams,useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";


export default function SearchJobs() {
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.users)
  console.log(user)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    jobtitle: searchParams.get("jobtitle") || "",
    location: searchParams.get("location") || "",
  });
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const { data, searchError,savedJobs,savedError,isloading} = useSelector((state) => state.jobapplying);
  console.log(savedJobs)
  console.log(savedError)
  console.log(data);
  console.log(searchError);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hasReloaded = sessionStorage.getItem("hasReloaded");
  
    if (!token && !hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);
   
    
      useEffect(() => {
          dispatch(getSaved());
      }, [dispatch]);


      useEffect(() => {
        if (search.jobtitle.trim() || search.location.trim()) {
          setSearchParams({
            jobtitle: search.jobtitle.trim(),
            location: search.location.trim(),
          });
      
          dispatch(searchingJobs(search))
            .unwrap()
            .then(() => setError(null))
            .catch((err) => setError(err.response?.data || "Something went wrong"));
        } else if (!search.jobtitle.trim()||!search.location.trim()){
          dispatch(withOutSearch());
        }
      }, [search.jobtitle, search.location, dispatch]); // Add `dispatch` here
      

  function handleSubmit(e) {
    e.preventDefault();
    const { location, jobtitle } = search;
    if (!location && !jobtitle) {
      setError("Please provide at least one detail.");
      return;
    } 
    dispatch(
      searchingJobs({
        jobtitle: jobtitle.trim(),
        location: location.trim()
      })
    )
      .unwrap()
      .then(() => {
        setError(null); 
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data || "Something went wrong");
      });
  }

  function handleJobClick(job){
    setSelectedJob(job);
   // console.log(job._id)
    const id = job._id
    console.log("count",id)
    dispatch(countJobClick({id}))
  };

  function handleSaveJobs(id){
    const token = localStorage.getItem("token")
    if(!token){
      toast.error("please login and save jobs")
      navigate("/")
    }
      console.log(id)
      if(savedJobs?.some((job)=>job._id==id)){
        //alert("job already saved")
        toast.error("job already saved")
        return 
      }
      dispatch(saveJobs({id}))
    
  }
  
  useEffect(()=>{
    if(data.length>0&&!selectedJob){
      setSelectedJob(data[0])
    }
  },[data,selectedJob])

  function handleApply(){
      const token = localStorage.getItem("token")
      if(!token){
        toast.error("please login and apply for the job")
        navigate("/")
      }
  }

  function handleInquire(){
    const token = localStorage.getItem("token")
    if(!token){
      toast.error("please login and inquire about the job")
      navigate("/")
    }
  }

 return(
   <div>
    <Navbar/>
    <div class="container mx-auto px-20 py-10">
 
  <div class="flex justify-center mb-8">
    <div class="">
      <form onSubmit={handleSubmit} class="flex h-10 border-gray-950" >
        <input
          type="search"
          value={search.jobtitle}
          onChange={(e) => setSearch({ ...search, jobtitle: e.target.value })}
          placeholder="Search for jobs by title "
          class="w-full p-1 border-2 border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <input
          type="search"
          value={search.location}
          onChange={(e) => setSearch({ ...search, location: e.target.value })}
          placeholder="Location"
          class="w-full p-1 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          class="px-8 py-4 bg-blue-600 text-white text-lg font-semibold  hover:bg-blue-700 flex items-center"
        >
        Search
        </button>
     
      </form>
      {error&&<p className="text-red-500">{error}</p>}
         <div> {searchError && (
        <p class="text-red-500 mb-4">{searchError.error}</p>
      )}</div>
    </div>
  </div> 

  <div class="flex gap-8">
   
    <div class="w-full lg:w-1/3 h-[500px] overflow-y-auto border-r-1  pr-4 ">
     
      <div>
        {data?.map((job) => (
          <div
            key={job._id}
            class="bg-white rounded-lg p-4 mb-4 shadow-md cursor-pointer transform transition-all hover:scale-105 border-2 border-gray-400"
            onClick={() => handleJobClick(job)}
          >
            <h1 class="text-xl font-semibold text-gray-800">{job.jobtitle}</h1>
            <p class="text-sm text-gray-600">{job.companyname}</p>
            <p class="text-sm text-gray-600">{job.location}</p>
            <p class="font-bold text-blue-500">{job.salary}</p>
            <p class="font-bold text-blue-500">{job.jobtype}</p>
          </div>
        ))}
      </div>
    </div>

    {selectedJob && (
      <div class="lg:w-2/3 w-full p-6 bg-gray-50 rounded-lg shadow-md pl-4">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">{selectedJob.jobtitle}</h1>
        <p class="text-lg text-gray-700 mb-2">
          <strong>Company:</strong> {selectedJob.companyname}
        </p>
        <p class="text-lg text-gray-700 mb-2">

          <strong>Location:</strong> {selectedJob.location}
          </p>
        <p class="text-lg text-gray-700 mb-2">
                          <strong>Salary:</strong> {selectedJob.salary}
        </p>
        <p class="text-lg text-gray-700 mb-2">
          <strong>Job Type:</strong> {selectedJob.jobtype}
        </p>
        <p class="text-lg text-gray-700 mb-2">
              <strong>Description:</strong> {selectedJob.description}
        </p>
        <p class="text-lg text-gray-700 mb-2">
          <strong>Experience Required:</strong> {selectedJob.experienceRequired}
        </p>
        <p class="text-lg text-gray-700 mb-2">
          <strong>Skills Required:</strong> {selectedJob.skillsrequired.join(', ')}
        </p>
        <p class="text-lg text-gray-700 mb-2">
          <strong>Deadline:</strong> {selectedJob.deadline}
        </p>
       <div className="flex gap-3 justify-center">
        <button className="mt-4 px-6 bg-red-600  text-white font-semibold rounded-md hover:bg-red-700" onClick={handleInquire}><Link to={`/candidatequery/${selectedJob._id}`}>Inquire About Job</Link></button>
        <button class="mt-4 py-2 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
         <Link to={`/apply/${selectedJob._id}`} onClick={handleApply}>Apply Now</Link> 
        </button>
        <button 
            className="mt-4 py-2 px-6 bg-green-400 text-white font-semibold rounded-md hover:bg-green-700" 
            onClick={() => handleSaveJobs(selectedJob?._id)}
          >
{Array.isArray(savedJobs) && savedJobs?.some(ele => ele?._id === selectedJob?._id) ? "saved" : "save"}
</button>

        </div>
        {/* {savedError&&<p className="text-red-400">{savedError}</p>} */}
      </div>
    )}
  </div>
</div>


   </div>
 )
}