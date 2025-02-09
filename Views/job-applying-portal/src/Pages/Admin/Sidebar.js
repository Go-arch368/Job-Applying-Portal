export default function Sidebar({setActiveTab}){
    
    return(
        <div className="flex flex-col items-start gap-8 ">
            
        {/*  <h1>This is the sidebar component</h1> */}
            <ul className=" bg-gray-500 text-white text-center pb-8 w-64 h-screen rounded-lg">
                <li onClick={()=>setActiveTab("dashboard")} className="block mb-8 mt-4 cursor-pointer">Dashboard</li>
                <li onClick={()=>setActiveTab("create")} className="block mb-8 cursor-pointer">Create JobFair</li>
                <li onClick={()=>setActiveTab("manage")} className="block mb-8 cursor-pointer">Manage JobFair</li>
                <li onClick={()=>setActiveTab("recruiters")} className="block mb-8 cursor-pointer">Registered Recruiters</li>
                <li onClick={()=>setActiveTab("candidates")} className="block mb-8 cursor-pointer">Registered Candidates</li>
            </ul>
        </div>
    )
}