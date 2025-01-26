import { Link } from "react-router-dom"
import "../index.css"
export default function Navbar(){
    return(
        <div className="navbar">
            <ul className="vertical">
                <li><Link to="/">Home</Link></li>
              <li><Link to="/register">Register</Link></li> 
               <li><Link to="/login">login</Link></li> 
            </ul>
        </div>
    )
}

