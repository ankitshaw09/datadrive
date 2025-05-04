import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/NavbarCss.css"; // Import the CSS file

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Hide navbar on login or register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="logo-link">
          <span className="logo">My Drive</span>
        </Link>
      </div>
      <div className="nav-right">
        <span className="username">
          {user?.name || user?.displayName || "User"}
        </span>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
