import { useParams} from "react-router-dom"
import {useEffect} from "react"
import { useDispatch,useSelector} from "react-redux"
import { getRejected } from "../redux/slices/jobapplySlice"
import Navbar from "./Navbar"
export default function AcceptedCandidates(){
    const dispatch = useDispatch()
    const {jobId} = useParams()
    console.log(jobId)
    const {rejected,serverError} = useSelector((state)=>state.jobapplying)
    console.log(rejected)
    console.log(serverError)
    useEffect(()=>{
       dispatch(getRejected({jobId}))
    },[])
    return(
        <div>
            <Navbar/>
            <h1>This is the accepted candidates</h1>
            {rejected.length>0?
               rejected.map((ele)=>(
                <>
                  <h1>Username:{ele.applicantId.name}</h1>
                  <h2>Email:{ele.applicantId.email}</h2>
                  <h2>status:{ele.status}</h2>
                </>
             
               ))
            :
            <p style={{color:"red"}}>{serverError}</p>}
        </div>
    )
}