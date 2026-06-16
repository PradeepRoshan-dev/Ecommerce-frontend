import React from "react";
import "./Nav.css";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar">

      <div className="logo">
        🎮 GAMEHAVEN
      </div>

      <ul className="nav-links">
        <li>
        <Link to="/">Home</Link>
        </li>
        <li>
        <Link to="/Product">Products</Link>
        </li>
        <li>
        <Link to="/Categories">Categories</Link>
        </li>
        <li>
        <Link to="/Deals">Deals</Link>
        </li>
        <li>
        <Link to="/Contact">Contact</Link>
        </li>
      </ul>

      <div className="nav-right">

        <input
          type="text"
          placeholder="Search gaming products..."
        />
        <button className="searchbtn"><FaSearch /></button>


       <Link to="/Cart"> <button className="cartbutton">🛒 Cart</button> </Link>
        <Link to="/Login"> <button id="loginbtn">Login</button> </Link>

      </div>

    </nav>
  );
}

export default Nav;