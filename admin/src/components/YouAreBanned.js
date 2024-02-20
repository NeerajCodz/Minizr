import React from 'react';
import BannedHosts from './BannedHosts';
import '../css/YouAreBanned.css'; // Import CSS file for styles

const YouAreBanned = () => {
    const { userIP } = BannedHosts();
    const emailAddress = 'your.email@example.com'; // Replace with your email address

    const handleContactUsClick = () => {
        const subject = `Appeal for banning ${userIP}`;
        const encodedSubject = encodeURIComponent(subject);
        window.location.href = `mailto:${emailAddress}?subject=${encodedSubject}`;
      };
      
  return (
    <div className="banned-container">
      <div className="banned-content">
        <img src='/imgs/icon-unique.png' alt="Banned" className="banned-image" />
        <p>You have been banned from this site.</p>
        <p>You can write an email to appeal.</p>
        <button onClick={handleContactUsClick}>Contact us</button>
      </div>
    </div>
  );
};

export default YouAreBanned;
