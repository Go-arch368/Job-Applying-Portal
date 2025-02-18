import Sidebar from "./Sidebar"
export default function TopApplicants(){
    return(
    <div className="flex">
            {/* Sidebar */}
            
            <Sidebar />

            {/* Content Area */}
            <div className="flex-1 p-6 ml-64">  {/* ml-64 to create space for the sidebar */}
                <h1>This is your active recruiters</h1>
                <p>lfdsljakff;fffffffffffffa;slfdsa;fds</p>
                <p>ldsfldsfdsaf</p>
                <p>dsalflkdsajflkdsflkdsaf</p>
                <p>dsaflksafkjdsafads</p>
                <p>fsadlflkjdsaf;sadddddd</p>
            </div>
        </div>
    )
}