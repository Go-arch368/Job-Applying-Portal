import { useState } from "react";
import { FiUsers, FiBriefcase, FiSettings, FiUserCheck } from "react-icons/fi"; // Icons

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "create", label: "Create JobFair", icon: <FiBriefcase /> },
    { id: "manage", label: "Manage JobFair", icon: <FiSettings /> },
    { id: "recruiters", label: "Registered Recruiters", icon: <FiUserCheck /> },
    { id: "candidates", label: "Registered Candidates", icon: <FiUsers /> },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg flex flex-col p-6 transition-all duration-300">
    
      <h2 className="text-xl font-semibold text-gray-200 mb-6 text-center">JobFair Admin</h2>

   
      <ul className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`cursor-pointer py-3 px-4 rounded-lg flex items-center gap-3 text-md font-medium transition-all duration-300 
              ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "hover:bg-gray-800 hover:text-gray-200"
              }`}
          >
            {item.icon} <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
