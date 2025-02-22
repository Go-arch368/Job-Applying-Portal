import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import SearchJobs from "./SearchJobs";
import VerifyingRecruiters from "./VerifyingRecruiters";
import PostingJobs from "./PostingJobs";
import { useEffect, useState } from "react";
import PostedJobs from "./PostedJobs";
import AdminDashboard from "./Adminanalysis/AdminDashboard";

export default function Dashboard() {
    const { user } = useSelector((state) => state.users) || {}; 
    const [roleComponent, setRoleComponent] = useState(null);

    useEffect(() => {
        if (!user || !user.role) {
            setRoleComponent(null); // Clear component on logout
            return;
        }

        if (user.role === "recruiter") {
            setRoleComponent(<PostedJobs />);
        } else if (user.role === "admin") {
            setRoleComponent(<VerifyingRecruiters/>);
        } else if (user.role === "candidate") {
            setRoleComponent(<SearchJobs />);
        } else {
            setRoleComponent(null);
        }
    }, [user]); 

    if (!user || !user.role) {
        return <div>Loading...</div>; // Prevent errors during logout
    }

    return (
        <div>
       
            {roleComponent}
        </div>
    );
}
