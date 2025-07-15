import React from "react";
import useAuthStore from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";

const Header = () => {
  const { user, isLoading, logout } = useAuthStore();
  return (
    <div className="h-16 w-full bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">
        OpenPin <Link to="/app">Dashboard</Link>
      </h1>

      {/* Placeholder for future profile dropdown or notification icon */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">
            Welcome,{" "}
            <span className="uppercase">{user?.name?.split(" ")[0]}</span>
          </span>
        )}
        <div className="h-8 w-8 rounded-full bg-gray-300" />{" "}
        {/* Avatar placeholder */}
        <button
          onClick={logout}
          className="py-0.5 px-1 bg-red-400 border-3 border-red-600 rounded-md cursor-pointer"
        >
          {isLoading ? (
            <ImSpinner3 size={20} className="animate-spin duration-[5s]" />
          ) : (
            "Logout"
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
