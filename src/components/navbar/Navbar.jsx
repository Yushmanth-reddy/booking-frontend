import "./navbar.css";

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const Navbar = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">Reddy Booking</span>
        </Link>
        {user ? (
          user.username
        ) : (
          <div className="naItems">
            <button className="navButton">Register</button>
            <button className="navButton">login</button>
          </div>
        )}
      </div>
    </div>
  );
};
