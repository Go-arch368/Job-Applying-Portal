import { Link } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import "../index.css"
export default function Navbar(){
    const {isLoggedIn,user} = useSelector((state)=>state.users)
    
    return(
        <div className="navbar">
            <ul className="vertical">

                <li><Link to="/">Home</Link></li>
                <li><Link to="/register">Register</Link></li> 
               <li><Link to="/login">login</Link></li> 
               <li><Link to ="/dashboard">Dashboard</Link></li>
            </ul>
        </div>
    )
}

