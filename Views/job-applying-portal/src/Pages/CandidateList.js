import { useParams } from "react-router-dom"
import { useSelector,useDispatch } from "react-redux"
import { useEffect } from "react"
import { getCandidates } from "../redux/slices/jobapplySlice"
export default function CandidateList(){
     const {jobId} = useParams()
     const dispatch = useDispatch()
     console.log(jobId)
    useEffect(()=>{
        dispatch(getCandidates({jobId}))
    })
    return(
        <div>
            <h1>This is you candidatelist component</h1>
        </div>
    )
}
