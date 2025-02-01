import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { addQtn, getQtn ,assignEditId,updateQuestions,deleteQuestions } from "../redux/slices/questionSlice";


export default function CreateQuestions() {
  const dispatch = useDispatch();
  const [newQuestion, setNewQuestion] = useState("");
  const { jobId } = useParams();
  const { data ,editId}  = useSelector((state) => state.questions);
  
  const questionsArray = data?.map(ele => ele.questions).flat()
  console.log(questionsArray)
  console.log(editId)
 
  useEffect(() => {
    dispatch(getQtn({ jobId }))
  }, [dispatch, jobId]);

  useEffect(()=>{
    if(editId){
        const questionId = questionsArray.find((ele)=>ele._id===editId)
        console.log(questionId.questionText)
        if(questionId){

            setNewQuestion(questionId?.questionText)
        }
    }
  },[editId])

  // Handle adding a new question
  const addQuestion = () => {
    if (!newQuestion.trim()) {
      alert("Question cannot be empty");
      return;
    }

   if(editId){
      dispatch(updateQuestions({editId,newQuestion})).unwrap()
      setNewQuestion("")
   }
   else{
    dispatch(addQtn({ newQuestion, jobId }))
    .unwrap()
    dispatch(getQtn({jobId})).unwrap()
    setNewQuestion("")
   }

    
  };
 
  function handleEdit(id){
    //    assignEditId({id})
   
   
       dispatch(assignEditId(id))
       console.log(id)
    
      
  }

  function handleDelete(id){
      console.log(id)
      const delet =  window.confirm("Are you sure?")
    if(delet){
     dispatch(deleteQuestions({id}))
      }
    
  }


  return (
    <div>
    <h1>Provide Questions</h1>
    <h1>Give atleast 6 questoins so the candidates can able send the video format of the answers for beloved questions so you can evaluate easily and select</h1>
    <h2>while applying for an job candidates while see the question in an video format so it will be easily you to accept or reject.</h2>
      <h1>{editId?"Edit Questions":"Add Questions"}</h1>
      <input
        type="text"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        className="border p-2 w-full mt-4"
        placeholder="Enter your question"
      />
  
      <button
        onClick={addQuestion}
        className="w-full bg-green-500 text-white p-2 mt-2 rounded"
      >
       {editId?"edit question":"add question"} 
      </button>
  
    {questionsArray.length >0&&questionsArray.map(ele => {
        return <p key={ele?._id}>{ele?.questionText}<button onClick={(e)=>handleEdit(ele?._id)} className="border bg-blue-500 p-2 px-4 rounded-xl text-white">Edit</button><button onClick={()=>{handleDelete(ele?._id)}} className="border bg-red-500 p-2 px-4 rounded-xl text-white">Delete</button></p>
    })
        
    }

    </div>
  );
  
}
