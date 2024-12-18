import React from 'react';
import '../styles/Footer.css';
import logo from '../images/logo.png';
import { FaFacebook, FaTwitter, FaGooglePlus, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const handleRedirect = (url) => {
    window.location.href = url; 
  };

  return (
    <footer>
      <div className="footer-content">
        <img src={logo} alt="Minizr Logo" className="footer-logo" /> 
        <p>Thank you for visiting our site.</p>
        <ul className="socials">
          <li><button onClick={() => handleRedirect('your_facebook_url')}><FaFacebook /></button></li>
          <li><button onClick={() => handleRedirect('your_twitter_url')}><FaTwitter /></button></li>
          <li><button onClick={() => handleRedirect('your_googleplus_url')}><FaGooglePlus /></button></li>
          <li><button onClick={() => handleRedirect('your_youtube_url')}><FaYoutube /></button></li>
          <li><button onClick={() => handleRedirect('your_linkedin_url')}><FaLinkedin /></button></li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p>Copyright &copy; 2024 Minizr. Designed by <span className="developer" onClick={() => handleRedirect('neeraj_creatz_url')}>Neeraj Creatz</span></p>
      </div>
    </footer>
  );
}

export default Footer;
