import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { applyingjob } from "../redux/slices/jobapplySlice";
import { toast } from "react-toastify";

export default function ApplyJobs() {
    const dispatch = useDispatch();
    const { jobId } = useParams();
    const navigate = useNavigate();

    // State management
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [resume, setResume] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [timestamps, setTimestamps] = useState([]);
    const [recordTime, setRecordTime] = useState(0);
    const [recordingCompleted, setRecordingCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Refs
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const videoChunks = useRef([]);
    const timerRef = useRef(null);
    const shuffleDone = useRef(false);
    const mediaStreamRef = useRef(null);

    // Redux state
    const { data, applying, serverError, isloading } = useSelector((state) => state.jobapplying);
    const findingQuestions = data?.filter((ele) => ele._id.toString() === jobId).map((ele) => ele.assignedQuestions);
    const flatQuestions = findingQuestions ? findingQuestions.flat() : [];

    // Shuffle questions on mount
    useEffect(() => {
        if (flatQuestions.length > 0 && !shuffleDone.current) {
            setSelectedQuestions(shuffleQuestions(flatQuestions));
            shuffleDone.current = true;
        }
    }, [flatQuestions]);

    // Helper functions
    function shuffleQuestions(questions) {
        let shuffled = [...questions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, 3);
    }

    function handleFileChange(e) {
        const selectedResume = e.target.files[0];
        setResume(selectedResume);
    }

    function handleStartRecording() {
        setIsRecording(true);
        setRecordTime(0);
        setRecordingCompleted(false);
        videoChunks.current = [];

        const videoStream = webcamRef.current?.video?.srcObject;
        if (!videoStream) return;

        mediaRecorderRef.current = new MediaRecorder(videoStream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                videoChunks.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const videoBlob = new Blob(videoChunks.current, { type: "video/webm" });
            setVideoBlob(videoBlob);
            setVideoUrl(URL.createObjectURL(videoBlob));

            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
            setRecordingCompleted(true);
        };

        mediaRecorderRef.current.start();
        timerRef.current = setInterval(() => {
            setRecordTime((prev) => prev + 1);
        }, 1000);
    }

    function handleStopRecording() {
        setIsRecording(false);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        clearInterval(timerRef.current);

        if (webcamRef.current && webcamRef.current.video.srcObject) {
            const tracks = webcamRef.current.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            webcamRef.current.video.srcObject = null;
        }
        setRecordingCompleted(true);
    }

    function handleNextQuestion() {
        if (currentQuestionIndex < selectedQuestions.length - 1) {
            setTimestamps((prevTimestamps) => [
                ...prevTimestamps,
                { questionIndex: currentQuestionIndex, timestamp: recordTime },
            ]);
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    }

    async function handleSubmitApplication(e) {
        e.preventDefault();
        setIsSubmitted(true);

        if (!resume || !videoBlob) {
            toast.error("Please upload your resume and complete the video interview");
            return;
        }

        const answeredQuestions = selectedQuestions.map((question, index) => ({
            questionText: question,
            startingTimeStamps: index === 0 ? "0" : timestamps[index - 1].timestamp,
        }));

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("video", videoBlob, "interview-video.webm");
        formData.append("answeredQuestions", JSON.stringify(answeredQuestions));

        dispatch(applyingjob({ jobId, formData }))
            .unwrap()
            .then(() => {
                toast.success("Successfully applied for the job");
            })
            .catch((error) => {
                setError(error.response?.data.message);
                toast.error(error.response?.data.message);
            });
    }

    function handleDashboard() {
        navigate("/dashboard");
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold text-center mb-4">Apply for Job</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Section: Resume Upload and Video Interview */}
                <div className="md:col-span-2 flex flex-col">
                    <div className="mb-4">
                        <h2 className="font-semibold">Upload Resume</h2>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="mt-2 p-2 border rounded w-full"
                        />
                    </div>

                    {selectedQuestions.length > 0 && (
                        <div className="mb-4">
                            {/* Display the current question */}
                            {isRecording && (
                                <h3 className="text-lg font-medium mb-2">
                                    {selectedQuestions[currentQuestionIndex]}
                                </h3>
                            )}

                            <Webcam
                                audio
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: "user" }}
                                className="rounded-lg border mb-2"
                                width="50%"
                                videoStyle={{ maxWidth: '60%', margin: 'auto' }}
                            />

                            <div className="flex space-x-4 justify-center mt-2">
                                {/* Start Recording Button */}
                                {!isRecording && !recordingCompleted && (
                                    <button
                                        onClick={handleStartRecording}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Start Recording
                                    </button>
                                )}

                                {/* Next Question Button */}
                                {isRecording && currentQuestionIndex < selectedQuestions.length - 1 && (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Next Question
                                    </button>
                                )}

                                {/* Stop Recording Button */}
                                {isRecording && currentQuestionIndex === selectedQuestions.length - 1 && (
                                    <button
                                        onClick={handleStopRecording}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Stop Recording
                                    </button>
                                )}
                            </div>

                            <p className="text-gray-700 mt-2">Recording Time: {recordTime}s</p>
                        </div>
                    )}

                    {videoUrl && (
                        <div className="mb-4">
                            <h3 className="font-semibold">Recorded Video</h3>
                            <video src={videoUrl} controls className="rounded-lg border w-full"></video>
                        </div>
                    )}

                    {/* Submit Application Button */}
                    {currentQuestionIndex === selectedQuestions.length - 1 && recordingCompleted && (
                        <button
                            onClick={handleSubmitApplication}
                            className="bg-purple-600 text-white px-4 py-2 mt-4 w-full rounded"
                        >
                            {isSubmitted ? "Submitted" : isloading ? "Submitting..." : "Submit Application"}
                        </button>
                    )}

                    {serverError && <p className="text-red-500 text-center">{serverError}</p>}

                    <div className="mt-4">
                        <h4 className="font-semibold">Timestamps</h4>
                        <p>Question 1 : 0</p>
                        {timestamps.map((entry, index) => (
                            <p key={index} className="text-gray-600">Question {entry.questionIndex + 2}: {entry.timestamp}s</p>
                        ))}
                    </div>
                </div>

                {/* Right Section: Job Details */}
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col justify-center items-start border p-6 rounded-lg shadow-lg bg-white w-96">
                        <h2 className="text-xl font-semibold mb-4">Job Details</h2>
                        {data?.map((ele) => ele?._id === jobId && (
                            <div key={ele._id} className="mt-4">
                                <p><strong>Job Title:</strong> {ele?.jobtitle}</p>
                                <p><strong>Location:</strong> {ele?.location}</p>
                                <p><strong>Salary:</strong> {ele?.salary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Home Button */}
            <button
                onClick={handleDashboard}
                className="bg-blue-500 text-white p-2 rounded-md"
            >
                Home
            </button>
        </div>
    );
}