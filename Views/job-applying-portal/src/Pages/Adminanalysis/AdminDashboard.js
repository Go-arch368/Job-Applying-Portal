import Sidebar from "./Sidebar";
import Navbar from "../../Components/Navbar";

export default function AdminDashboard() {
    return (
        <div className="flex flex-col h-screen">
            {/* Navbar at the Top */}
            <Navbar />

            {/* Main Content Area */}
            <div className="flex flex-1 pt-16"> {/* Add pt-16 to account for the Navbar height */}
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 p-6 ml-64 overflow-y-auto bg-gray-100">
                    <h1 className="text-2xl font-bold mb-6">Welcome to Admin Dashboard</h1>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-700">
                            This is the main content area. You can add charts, tables, or other components here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}