import React from 'react';
import BannedHosts from '../utils/getHosts';
import '../styles/YouAreBanned.css'; // Import CSS file for styles

import { FaBan } from "react-icons/fa";

const YouAreBanned = () => {
    const { CreatorIP } = BannedHosts();
    const emailAddress = 'neerajcodz@example.com'; // Replace with your email address

    const handleContactUsClick = () => {
        const subject = `Appeal for banning ${CreatorIP}`;
        const encodedSubject = encodeURIComponent(subject);
        window.location.href = `mailto:${emailAddress}?subject=${encodedSubject}`;
    };
      
    return (
        <div className="banned-container">
            <div className="banned-content">
                <FaBan className="banned-image" alt="Banned" />
                <p>We're sorry, but access to this site has been restricted.</p>
                <p> </p>
                <p>If you believe this is a mistake, please contact us to appeal.</p>
                <button onClick={handleContactUsClick}>Contact Us</button>
            </div>
        </div>
    );
};

export default YouAreBanned;
