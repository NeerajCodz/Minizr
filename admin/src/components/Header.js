import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Importing Font Awesome menu icon
import logo from '../images/logo.png';
import '../styles/Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="nav-container">
      <nav>
        <div className="header-content">
          <Link to="/" className="title">
            <img src={logo} alt="Website Logo" />
          </Link>
          <div className="menu" onClick={toggleMenu}>
            <FaBars /> {/* React Icons menu icon */}
          </div>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          <li>
            <NavLink to="/home" onClick={toggleMenu}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/analytics" onClick={toggleMenu}>Analytics</NavLink>
          </li>
          <li>
            <NavLink to="/services" onClick={toggleMenu}>Services</NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={toggleMenu}>LOGIN</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
