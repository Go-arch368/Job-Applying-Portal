import { useNavigate } from "react-router-dom"
export default function Success(){
    const navigate = useNavigate()
    function handleClick(){
        navigate("/dashboard")
    }
    return(
        <div>
            <h1>this success</h1>
            <button onClick={handleClick} className="bg-blue-600 text-white p-3 px-2">Go to Dashboard</button>
        </div>
    )
}