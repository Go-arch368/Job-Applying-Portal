import {Route,Routes} from "react-router-dom"
import Register from "./Pages/Register";
import Login from "./Pages/Login";

import Home from "./Pages/Home";
import Dashboard from "./Components/Dashboard";
function App() {
  return (
    <div className="text-center">
      
     <Routes>
      <Route path="/" element={<Home/>}/>
       <Route path="/register" element={<Register/>}/>
       <Route path="/login" element={<Login/>}/>
       <Route path="/dashboard" element={<Dashboard/>}/>
     </Routes>
    </div>
  );
}

export default App;
