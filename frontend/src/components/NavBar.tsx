import React, { useContext } from "react";

import { NavLink } from "react-router-dom";

import { AuthContext } from "contexts/AuthContext";

import { FaCar } from "react-icons/fa";

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <ul className="flex items-center">
        {/* Left: Car Icon */}
        <li>
          <NavLink to="/welcome">
            <FaCar size={24} className="text-white" />
          </NavLink>
        </li>

        {/* Right: NavLinks */}
        {isAuthenticated() ? (
          <li className="flex space-x-4 ml-auto">
            <NavLink
              to="/cars"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-400 hover:text-white"
              }
            >
              Cars
            </NavLink>
            <button
              onClick={() => logout()}
              className="text-gray-400 hover:text-white"
            >
              Logout
            </button>
          </li>
        ) : (
          <li className="flex space-x-4 ml-auto">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
