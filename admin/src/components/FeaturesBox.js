import React from 'react';
import '../styles/Home.css'
import { BiLike, BiLink, BiLock, BiBarChart, BiCheckShield, BiMobileAlt } from 'react-icons/bi'; // Import Bi icons from react-icons/bi

// FeatureBox component displays an icon, title, and description
function FeatureBox({ icon, title, description }) {
  return (
    <div className="feature-box">
      <div className="icon">{icon}</div> {/* Render the icon */}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// FeatureBoxes component renders multiple FeatureBox components
function FeatureBoxes() {
  return (
    <div className="FeaturesBox">
      <h1> WHY Minizr?</h1> {/* Heading above the feature boxes */}
      <div className="feature-boxes">
        {/* Each FeatureBox component receives an icon, title, and description */}
        <FeatureBox
          icon={<BiLike />} // Use BiLike icon for "Easy"
          title="Easy"
          description="ShortURL is easy and fast, enter the long link to get your shortened link"
        />
        <FeatureBox
          icon={<BiLink />} // Use BiLink icon for "Shortened"
          title="Shortened"
          description="Use any link, no matter what size, ShortURL always shortens"
        />
        <FeatureBox
          icon={<BiLock />} // Use BiLock icon for "Secure"
          title="Secure"
          description="It is fast and secure, our service has HTTPS protocol and data encryption"
        />
        <FeatureBox
          icon={<BiBarChart />} // Use BiBarChart icon for "Statistics"
          title="Statistics"
          description="Check the number of clicks that your shortened URL received"
        />
        <FeatureBox
          icon={<BiCheckShield />} // Use BiCheckShield icon for "Reliable"
          title="Reliable"
          description="All links that try to disseminate spam, viruses and malware are deleted"
        />
        <FeatureBox
          icon={<BiMobileAlt />} // Use BiMobileAlt icon for "Devices"
          title="Devices"
          description="Compatible with smartphones, tablets and desktop"
        />
      </div>
    </div>
  );
}

export default FeatureBoxes;
