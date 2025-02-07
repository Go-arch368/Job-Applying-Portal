import { useEffect } from "react"
import Navbar from "../Components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { getApplied } from "../redux/slices/jobapplySlice"

export default function AppliedJobs(){
    const dispatch = useDispatch()
    const {applied} = useSelector((state)=>state.jobapplying)
    console.log(applied)
    useEffect(()=>{
        dispatch(getApplied())
    },[dispatch])
    return(
        <div>
           <Navbar/>
           <h1>This is the applied jobs component</h1> 
          <table>
            <thead>
                <tr>
                    <th>Jobtitle</th>
                    <th>CompanyName</th>
                    <th>Jobtype</th>
                    <th>Status</th>
                </tr>
            </thead>
          </table>
        </div>
    )
}