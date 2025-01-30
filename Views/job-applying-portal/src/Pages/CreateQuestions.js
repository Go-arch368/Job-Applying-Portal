import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState ,useEffect} from "react";
import { addQtn } from "../redux/slices/questionSlice";
import { getQtn } from "../redux/slices/questionSlice";


export default function CreateQuestions() {
    const dispatch = useDispatch();
    const [newQuestion, setNewQuestion] = useState("");
    const { jobId } = useParams();

    const {data} = useSelector((state)=>state.questions)
    console.log(data)

    // useEffect(()=>{
    //     dispatch(getQtn({jobId}))
    // },[dispatch,jobId])

     function addQuestion() {
             dispatch(addQtn({ newQuestion, jobId })).unwrap()
            //  .then(()=>{
            //     // dispatch(getQtn({jobId}))
            //     setNewQuestion("") 
            //  })
            //  .catch((error)=>{
            //     console.log(error)
            //  })
               
    }

    return (
        <div>
            <h1>You are creating your questions</h1>
            
            <input type="text" value={newQuestion}  onChange={(e) => setNewQuestion(e.target.value)} className="border p-2 w-full mt-4"  />
            <button onClick={addQuestion} className="w-full bg-green-500 text-white p-2 mt-2 rounded">
                Add Question
            </button>
           
        </div>
    );
}
