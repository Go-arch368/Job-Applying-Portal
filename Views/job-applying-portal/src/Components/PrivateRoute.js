import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, role }) => {

  const {user,isloggedIn} = useSelector((state) => state.users);
  console.log("hi",user)
  console.log("role",role)
  console.log("loggedIn",isloggedIn)
  const publicRoutes = ["/searchJobs"] 
  if(publicRoutes.includes(window.location.pathname)){
      return children
  }
  if (!isloggedIn) return <Navigate to="/" replace/>; 
  if (user.role !== role) return <Navigate to="/unauthorized" replace/>; 

  return children;
};

export default PrivateRoute;