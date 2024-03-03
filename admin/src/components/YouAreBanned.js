import React from 'react';
import BannedHosts from './Hosts';
import unique from "../images/icons/unique.png"
import '../css/YouAreBanned.css'; // Import CSS file for styles
import '../css/Home.css'

const YouAreBanned = () => {
    const { CreatorIP } = BannedHosts();
    const emailAddress = 'your.email@example.com'; // Replace with your email address

    const handleContactUsClick = () => {
        const subject = `Appeal for banning ${CreatorIP}`;
        const encodedSubject = encodeURIComponent(subject);
        window.location.href = `mailto:${emailAddress}?subject=${encodedSubject}`;
      };
      
  return (
    <div className="banned-container">
      <div className="banned-content">
        <img src={unique} alt="Banned" className="banned-image" />
        <p>You have been banned from this site.</p>
        <p>You can write an email to appeal.</p>
        <button onClick={handleContactUsClick}>Contact us</button>
      </div>
    </div>
  );
};

export default YouAreBanned;
