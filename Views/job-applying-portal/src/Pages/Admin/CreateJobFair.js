import { useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { createEvent ,updateEvent} from "../../redux/slices/jobFairSlice";
import {format} from "date-fns"
import { useNavigate } from "react-router-dom";
export default function CreateJobFair(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        location: "",
        description: "",
      });
    const {editId} = useSelector((state)=>state.jobFair)
    console.log(editId)
    const [clientError,setClientError] = useState({})

    const {data,serverError} = useSelector((state)=>state.jobFair)
    console.log(data)
    
    useEffect(()=>{
       if(editId){
          const editIdData = data.find((ele)=>ele._id===editId)
          if(editIdData){
            const changingDate =editIdData.date?format(new Date(editIdData.date),"yyyy-MM-dd"):""
            console.log(changingDate)
            setFormData({
                name: editIdData.name,
                date: changingDate,
                location:editIdData.location,
                description:editIdData.description,
              })
          }
       }
    },[editId,data])

    function validation(){
        let errors={}
        if(!formData.name.trim()){
            errors.name="the name field is required"
        }
        if(!formData.date.trim()){
            errors.date="the date field is required"
        }
        if(!formData.location.trim()){
            errors.location="the location field is required"
        }
        if(!formData.description.trim()){
            errors.description="the description field is required"
        }
        return errors
    }

     function handleSubmit(e){
        e.preventDefault()
        let errors = validation()
        if(Object.keys(errors).length!==0){
              setClientError(errors)
        }
        else{
            setClientError({})
            console.log(formData)
            if(editId){
                dispatch(updateEvent({formData,editId,navigate}))
            }
            else{
                dispatch(createEvent({formData})).unwrap()
                try{
                    alert("successfully created")
                    setFormData({
                        name: "",
                        date: "",
                        location: "",
                        description: ""
                    })
                }catch(error){
                    console.log(error)
                } 
            }
        }
       
     
     }

    return(
        <div>
            <h1>{editId?"Edit":"Create"}JobFair</h1>
            <form onSubmit={handleSubmit}>
                <div>
                <label>Job Fair Name</label>
                <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} className="border" />
                {clientError.name&&<p style={{color:"red"}}>{clientError.name}</p>}
                </div>
                <div>
                 <label>Date</label>   
                 <input type="date"  value={formData.date} onChange={(e)=>setFormData({...formData,date:e.target.value})}  />
                 {clientError.date&&<p style={{color:'red'}}>{clientError.date}</p>}
                </div>
                <div>
                 <label>Location</label>   
                 <input type="text" value={formData.location} onChange={(e)=>setFormData({...formData,location:e.target.value})} className="border" />
                 {clientError.location&&<p style={{color:"red"}}>{clientError.location}</p>}
                </div>
                <div>
                <label>Description</label>
                <textarea value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})} className="border"></textarea>
                {clientError.description && <p style={{color:"red"}}>{clientError.description}</p>}
                </div>
                <div>
                    <button className="border bg-blue-600 p-2 rounded-lg text-white" type="submit">{editId?"Edit":"Create"}JobFair</button>
                </div>
            </form>
        </div>
    )
}