import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Users, ClipboardList, BarChart, FileText, UserCheck } from "lucide-react";

export default function Sidebar() {
    const navigate = useNavigate(); // Initialize navigate function

    return (
        <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 shadow-lg flex flex-col justify-between">
            {/* Sidebar Header */}
            <div>
                {/* Previous Page Button with Color */}
                <div className="p-4 border-t border-gray-700 mt-5">
                    <button 
                        onClick={() => navigate("/dashboard")} 
                        className="flex items-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 w-full "
                    >
                        <ArrowLeft className="w-5 h-5 mr-3" />
                        <span>Previous Page</span>
                    </button>
                </div>

                {/* Sidebar Menu */}
                <ul className="p-4 space-y-4">
                    <SidebarItem to="/admin/total-candidates" icon={Users} label="Total Candidates" />
                    <SidebarItem to="/admin/total-recruiters" icon={Briefcase} label="Total Recruiters" />
                    <SidebarItem to="/admin/application-status" icon={ClipboardList} label="Application Status" />
                    <SidebarItem to="/admin/subscription-status" icon={BarChart} label="Subscription Status" />
                    <SidebarItem to="/admin/recent-jobs" icon={FileText} label="Recent Jobs" />
                    <SidebarItem to="/admin/active-recruiters" icon={UserCheck} label="Active Recruiters" />
                </ul>
            </div>
        </div>
    );
}

// Sidebar Item Component
function SidebarItem({ to, icon: Icon, label }) {
    return (
        <li>
            <Link to={to} className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-800 transition">
                <Icon className="w-5 h-5 mr-3" />
                <span>{label}</span>
            </Link>
        </li>
    );
}
