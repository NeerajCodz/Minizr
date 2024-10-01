import React, { useState } from "react";
import logo from '../images/logo.png'; // Ensure this path is correct
import '../styles/Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-image" /> {/* Using an image logo */}
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <div className={isOpen ? "bar1 change" : "bar1"}></div>
        <div className={isOpen ? "bar2 change" : "bar2"}></div>
        <div className={isOpen ? "bar3 change" : "bar3"}></div>
      </div>
      <nav className={isOpen ? "nav-links open" : "nav-links"}>
        <a href="/">Home</a>
        <a href="/analytics">Analytics</a>
        <a href="/login">LOGIN</a>
      </nav>
    </header>
  );
};

export default Header;
