import {Route,Routes} from "react-router-dom"
import Register from "./Pages/Register";

import Home from "./Pages/Home";
function App() {
  return (
    <div className="text-center">
      
     <Routes>
      <Route path="/" element={<Home/>}/>
       <Route path="/register" element={<Register/>}/>
     </Routes>
    </div>
  );
}

export default App;
