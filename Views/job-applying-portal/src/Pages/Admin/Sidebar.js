const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
      { id: "dashboard", label: "Dashboard" },
      { id: "create", label: "Create JobFair" },
      { id: "manage", label: "Manage JobFair" },
      { id: "recruiters", label: "Registered Recruiters" },
      { id: "candidates", label: "Registered Candidates" },
    ];
  
    return (
      <nav className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-xl flex flex-col p-6">
        <ul className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`cursor-pointer py-3 px-4 rounded-lg text-md text-center duration-300 ease-in-out hover:bg-gray-700 hover:text-gray-300 ${
                activeTab === item.id ? "bg-blue-600 text-white" : ""
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  
  export default Sidebar;
  