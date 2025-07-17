// src/components/Header.jsx
import React from "react";
import useAuthStore from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FiBell, FiLogOut } from "react-icons/fi";

export default function Header() {
  const { user, isLoading, logout } = useAuthStore();

  // Helper to get user initials
  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-white shadow-sm">
      {/* Left: Dashboard title */}
      <div>
        <Link to="/app" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
          Dashboard
        </Link>
      </div>

      {/* Right: Notifications, Greeting, Avatar, Logout */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Notifications"
        >
          <FiBell size={20} className="text-gray-600" />
        </button>

        {/* Greeting */}
        {user && (
          <span className="hidden sm:inline text-gray-700">
            Hello, <span className="font-medium">{user.name.split(" ")[0]}</span>
          </span>
        )}

        {/* Avatar */}
        <Link to={"/app/profile"}
          className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 text-white font-semibold rounded-full"
          title={user?.name}
        >
          {initials || <FiBell />} 
        </Link>

        {/* Logout */}
        {/* <button
          onClick={logout}
          className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition"
        >
          {isLoading ? (
            <ImSpinner3 className="animate-spin" size={18} />
          ) : (
            <>
              <FiLogOut size={18} /> Logout
            </>
          )}
        </button> */}
      </div>
    </header>
  );
}
