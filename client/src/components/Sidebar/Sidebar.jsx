// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiMenu,
  FiGrid,
  FiCpu,
  FiKey,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import useAuthStore from "../../store/useAuthStore";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {logout} = useAuthStore()

  const navLinks = [
    { name: "Projects", path: "/app/projects", icon: <FiGrid size={20} /> },
    { name: "Devices",  path: "/app/devices",  icon: <FiCpu size={20} /> },
    { name: "API Keys", path: "/app/credentials", icon: <FiKey size={20} /> },
    { name: "Settings", path: "/app/settings",    icon: <FiSettings size={20} /> },
  ];

  return (
    <div
      className={`h-screen flex flex-col bg-white shadow-lg transition-width duration-300 ${
        collapsed ? "w-16" : "w-52"
      }`}
    >
      {/* Brand & Toggle */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        {!collapsed && (
          <Link to="/" className="text-xl font-extrabold tracking-wide">
            OpenPin
          </Link>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1 cursor-pointer hover:bg-opacity-20 rounded-full transition-transform"
          style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0)" }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        {navLinks.map(({ name, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            title={collapsed ? name : undefined}
            className={({ isActive }) =>
              `flex items-center justify-center gap-4 px-4 py-3 mx-2 my-1 rounded-lg transition-colors 
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-100 to-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <div
              className={`p-2 rounded-md transition-colors ${
                ({ isActive }) =>
                  isActive ? "bg-white shadow" : "bg-transparent"
              }`}
            >
              {icon}
            </div>
            {!collapsed && <span className="flex-1 text-nowrap">{name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto">
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg transition"
          title="Logout"
          onClick={logout}
        >
          <FiLogOut size={16}  />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <div className="mt-4 text-xs text-gray-400 text-center">
            v1.0.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
