import { Link } from "react-router-dom"
import "../index.css"
export default function Navbar(){
    return(
        <div className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </div>
    )
}

