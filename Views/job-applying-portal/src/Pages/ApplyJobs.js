import {  useDispatch,useSelector } from "react-redux"
import {useState,useEffect,useRef} from "react"
import { useParams } from "react-router-dom"
import Webcam from "react-webcam"

export default function ApplyJobs(){
    const {jobId} = useParams()
    console.log(jobId)
    const  {data} = useSelector(state=>state.jobapplying)
    const findingQuestions = data.filter((ele)=>ele._id===jobId).map((ele)=>ele.assignedQuestions)
     console.log(findingQuestions.flat())

     const flatQuestions = findingQuestions?findingQuestions.flat():[]
     console.log(flatQuestions)

     const getRandomQuestions = ()=>{
        if(flatQuestions.length<3) return flatQuestions
        const shuffledQuestions = [...flatQuestions]
        for(let i=shuffledQuestions.length-1;i>=0;i--){
            const j = Math.floor(Math.random()*(i+1))
            [shuffledQuestions[i],shuffledQuestions[j]]=[shuffledQuestions[j],shuffledQuestions[i]]
        }
        return shuffledQuestions.slice(0,3)
     }

     const [selectedQuestions,setSelectedQuestions] = useState([])
     const [currentQuestionIndex,setCurrentQuestionIndex] = useState(0)
     const [resume,setResume] = useState(null)
     const [isRecording,setIsRecording] = useState(false)
     const [videoBlob,setVideoBlob] = useState(null)
     const [videoUrl,setVideoUrl] = useState(null)
     const [timestamps,setTimestamps] = useState([])

     const webcamRef = useRef(null)
     const mediaRecorderRef = useRef(null)
     const videoChunks = useRef([])

     useEffect(()=>{
        if(flatQuestions){
            const randomQuestions = getRandomQuestions()
            setSelectedQuestions(randomQuestions)
        }
     },[flatQuestions])
    
    function handleFileChange(e){
        setResume(e.target.files[0])
    }

    function handleStartRecording(){
        setIsRecording(true)
        videoChunks.current=[]
        const stream = webcamRef.current.stream
        mediaRecorderRef.current = new MediaRecorder(stream)
        mediaRecorderRef.current.ondataavailable = (event)=>{
            videoChunks.current.push(event.data)
        }
        mediaRecorderRef.current.onstop = ()=>{
            const videoBlob = new Blob(videoChunks.current,{type:"video/webm"})
            setVideoBlob(videoBlob)
            setVideoUrl(URL.createObjectURL(videoBlob))
        }
        mediaRecorderRef.current.start()
    }
    function handleStopRecording(){
       setIsRecording(false)
       mediaRecorderRef.current.stop()
    }

    function handleNextQuestion(){
        if(currentQuestionIndex<selectedQuestions.length-1){
            const currentTimestamp =  webcamRef.current.getInternalPlayer()?.currentTime||0
           setTimestamps((prevTimestamps)=>[
            ...prevTimestamps,{questionIndex:selectedQuestions[currentQuestionIndex],timestamp:currentTimestamp}
           ])
           setCurrentQuestionIndex(prevIndex=>prevIndex+1)
        }
    }

   async function handleSubmitApplication(e){
        e.preventDefault()
        if(!resume||!videoBlob){
            alert("please upload your resume and complete the video interview")
            return
        }
        const formData = new FormData()
        formData.append("resume",resume)
        formData.append("video",videoBlob)
       
   } 

    return(
        <div>
            <h1>Applying Jobs</h1>
            <div>
                <h2>Upload Resume</h2>
                <input type="file" accept=".pdf,.docx" onChange={handleFileChange}/>
            </div>
            {/* {selectedQuestions.map((ele)=>(
                <p>{ele}</p>
            ))} */}
            {selectedQuestions.length>0&&(
                <div>

                    <h3>{selectedQuestions[currentQuestionIndex]}</h3>
                    <Webcam
                    audio={true}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'user' }}
                    width="400"
                    />

                <div>
                    {!isRecording?(
                       <button onClick={handleStartRecording}>Start Recording</button>
                    ):(
                        <button onClick={handleStopRecording}>Stop Recording</button>
                    )}
                 </div>

                 {currentQuestionIndex<selectedQuestions.length-1&&(
                    <button onClick={handleNextQuestion}>Next</button>
                 )}

                 </div>
            )}

                 {currentQuestionIndex===selectedQuestions.length-1&&(
                <button onClick={handleSubmitApplication}>Submit Application</button>
              )} 


             {/* {timestamps.map((entry,index)=>(
                <div>

                </div>
             ))} */}

             {timestamps.length>0&&(
                <div>
                    <h4>Timestamps</h4>
                    {timestamps.map((entry,index)=>(
                        <div key={index}>
                            <p>Question:{entry.questionIndex}:{entry.timestamp.toFixed(2)}s</p>
                        </div>
                    ))}
                </div>
             )}

        </div>
    )
}


