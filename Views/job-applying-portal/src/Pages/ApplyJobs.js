import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { applyingjob } from "../redux/slices/jobapplySlice";
import { toast } from "react-toastify";
import { FaFileAlt, FaVideo, FaStop, FaStepForward, FaPlay, FaCheckCircle, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaArrowLeft, FaClock } from "react-icons/fa";

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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8 animate-fadeInDown">
                    <div>
                        <button
                            onClick={handleDashboard}
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-2"
                        >
                            <FaArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold gradient-text">Application Submission</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Section: Context (Resume & Video Interview) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Resume Card */}
                        <div className="glass-card rounded-2xl p-6 sm:p-8 card-hover animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                                    <FaFileAlt size={20} />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">1. Upload Resume</h2>
                            </div>
                            
                            <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 bg-white/50 text-center hover:bg-white transition-colors group relative">
                                <input
                                    type="file"
                                    accept=".pdf,.docx"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id="resume-upload"
                                />
                                <div className="space-y-2 pointer-events-none">
                                    <FaFileAlt className="mx-auto text-indigo-300 group-hover:text-indigo-500 transition-colors" size={32} />
                                    <p className="text-gray-600 font-medium">Click or drag file to upload</p>
                                    <p className="text-sm text-gray-400">PDF, DOCX up to 5MB</p>
                                    {resume && (
                                        <div className="mt-4 inline-flex items-center gap-2 badge badge-indigo animate-fadeIn">
                                            <FaCheckCircle /> {resume.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Video Interview Card */}
                        {selectedQuestions.length > 0 && (
                            <div className="glass-card rounded-2xl p-6 sm:p-8 card-hover animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                            <FaVideo size={20} />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">2. Video Interview</h2>
                                    </div>
                                    
                                    {isRecording && (
                                        <div className="badge badge-rose animate-pulse flex items-center gap-2 px-3 py-1.5">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            Recording: {recordTime}s
                                        </div>
                                    )}
                                </div>

                                {isRecording && (
                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-6 shadow-sm">
                                        <p className="text-sm text-indigo-600 font-medium uppercase tracking-wider mb-1">Question {currentQuestionIndex + 1} of {selectedQuestions.length}</p>
                                        <h3 className="text-lg font-semibold text-gray-800 leading-snug">
                                            {selectedQuestions[currentQuestionIndex]}
                                        </h3>
                                    </div>
                                )}

                                <div className="relative rounded-2xl overflow-hidden ring-4 ring-slate-100 bg-black aspect-video flex items-center justify-center mb-6 shadow-inner">
                                    {!videoUrl ? (
                                        <Webcam
                                            audio
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            videoConstraints={{ facingMode: "user" }}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <video src={videoUrl} controls className="w-full h-full object-cover"></video>
                                    )}
                                </div>

                                {/* Video Actions */}
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {!isRecording && !recordingCompleted && (
                                        <button
                                            onClick={handleStartRecording}
                                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <FaPlay /> Start Recording
                                        </button>
                                    )}

                                    {isRecording && currentQuestionIndex < selectedQuestions.length - 1 && (
                                        <button
                                            onClick={handleNextQuestion}
                                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <FaStepForward /> Next Question
                                        </button>
                                    )}

                                    {isRecording && currentQuestionIndex === selectedQuestions.length - 1 && (
                                        <button
                                            onClick={handleStopRecording}
                                            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white px-6 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <FaStop /> Finish Recording
                                        </button>
                                    )}
                                </div>

                                {/* Timestamps Preview */}
                                {timestamps.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-4">
                                            <FaClock className="text-gray-400"/> Recording Timestamps
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="badge badge-indigo">Q1 @ 0s</span>
                                            {timestamps.map((entry, index) => (
                                                <span key={index} className="badge badge-indigo">
                                                    Q{entry.questionIndex + 2} @ {entry.timestamp}s
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submission Area */}
                        {currentQuestionIndex === selectedQuestions.length - 1 && recordingCompleted && (
                            <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                                <button
                                    onClick={handleSubmitApplication}
                                    disabled={isSubmitted || isloading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${
                                        isSubmitted 
                                        ? "bg-green-500 cursor-not-allowed" 
                                        : "btn-primary-gradient cursor-pointer"
                                    }`}
                                >
                                    {isSubmitted ? (
                                        <span className="flex items-center justify-center gap-2"><FaCheckCircle/> Application Received</span>
                                    ) : isloading ? (
                                        "Submitting securely..."
                                    ) : (
                                        "Submit Final Application"
                                    )}
                                </button>
                                {serverError && (
                                    <div className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-center font-medium animate-fadeIn">
                                        {serverError}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Section: Job Overview Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl p-6 sticky top-24 card-hover animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <h2 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Job Overview</h2>
                            {data?.map((ele) => ele?._id === jobId && (
                                <div key={ele._id} className="space-y-6">
                                    {ele?.companyname && (
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium mb-1">Company</p>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-lg">
                                                    <FaBriefcase size={16} />
                                                </div>
                                                <p className="font-semibold text-gray-800 text-lg leading-tight">{ele?.companyname}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Position</p>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-lg">
                                                <FaBriefcase size={16} />
                                            </div>
                                            <p className="font-semibold text-gray-800 text-lg leading-tight">{ele?.jobtitle}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Location</p>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-lg">
                                                <FaMapMarkerAlt size={16} />
                                            </div>
                                            <p className="font-medium text-gray-700">{ele?.location}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Compensation</p>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-lg">
                                                <FaMoneyBillWave size={16} />
                                            </div>
                                            <p className="font-medium text-gray-700">{ele?.salary}</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-gray-100">
                                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100/50">
                                            <p className="text-sm text-indigo-800">
                                                <span className="font-bold">Pro tip:</span> Ensure you maintain eye contact with the camera and speak clearly during the video interview phase.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}