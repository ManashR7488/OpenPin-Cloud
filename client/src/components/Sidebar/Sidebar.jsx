import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiGrid, FiCpu, FiKey, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navLinks = [
    { name: "Projects", path: "/app/projects", icon: <FiGrid /> },
    // { name: "Devices", path: "/app/devices", icon: <FiCpu /> },
    { name: "Api key", path: "/app/credentials", icon: <FiKey /> },
    { name: "Settings", path: "/app/settings", icon: <FiSettings /> },
  ];

  return (
    <div
      className={`h-screen border-r bg-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-4">
        <span className={`font-bold text-lg ${collapsed ? "hidden" : "block"}`}>
          OpenPin
        </span>
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-600 cursor-pointer">
          <FiMenu />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col mt-4 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-all ${
                isActive ? "bg-gray-200 font-semibold" : "text-gray-700"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {!collapsed && <span className="text-sm">{link.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
