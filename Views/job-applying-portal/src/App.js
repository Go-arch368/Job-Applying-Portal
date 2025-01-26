import {Route,Routes} from "react-router-dom"
import Register from "./Pages/Register";
import Login from "./Pages/Login";

import Home from "./Pages/Home";
function App() {
  return (
    <div className="text-center">
      
     <Routes>
      <Route path="/" element={<Home/>}/>
       <Route path="/register" element={<Register/>}/>
       <Route path="/login" element={<Login/>}/>
     </Routes>
    </div>
  );
}

export default App;
