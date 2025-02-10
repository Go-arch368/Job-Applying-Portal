import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAll,jobFaireditId,deleteEvent } from "../../redux/slices/jobFairSlice";
import {format} from "date-fns"
import { useNavigate } from "react-router-dom";


export default function ManageJobFair() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  const { data } = useSelector((state) => state.jobFair);
 

    function handleEdit(id){
      console.log(id)
      dispatch(jobFaireditId(id))
      navigate("/createjobFair")
    }

    function handleDelete(id){
        console.log(id)
        const confirm = window.confirm("Are you Sure?")
        if(confirm){
            dispatch(deleteEvent({id}))
        }
       
    }


  return (
    <div className="p-4">
      <div className=" grid grid-cols-2  gap-4">
        {data.length > 0 ? (
          data.map((ele) => (
            <div key={ele._id} className="p-4 border rounded-lg shadow bg-white">
              <h1 className="font-bold text-lg">Name: {ele.name}</h1>
              <h2 className="text-gray-700">Description: {ele.description}</h2>
              <h2 className="text-gray-700">Date: {(format(ele.date,"yyyy-MM-dd"))}</h2>
              <h2 className="text-gray-700">Location: {ele.location}</h2>
              <h3 className="">
                Status: {new Date(ele.date) < new Date() ? "Expired" : <p className="text-green-500 inline">{ele.status}</p>}
              </h3>

              <div className="mt-4 flex gap-2 justify-center">
                <button className="border bg-orange-400 text-white px-4 py-1 rounded" onClick={()=>handleEdit(ele._id)}>Edit</button>
                <button className="border bg-red-500 text-white px-4 py-1 rounded" onClick={()=>handleDelete(ele._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No job fairs available</p>
        )}
      </div>
    </div>
  );
}
