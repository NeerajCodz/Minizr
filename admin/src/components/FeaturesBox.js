import React from 'react';
import '../css/FeatureBox.css'; // Import CSS file for styling

function FeatureBox({ iconSrc, title, description }) {
  return (
    <div className="feature-box">
      <div className="icon"><img src={iconSrc} alt="icon" /></div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function FeatureBoxes() {
  return (
    <div className="feature-boxes">
      <FeatureBox
        iconSrc="/imgs/icon-like.png"
        title="Easy"
        description="ShortURL is easy and fast, enter the long link to get your shortened link"
      />
      <FeatureBox
        iconSrc="/imgs/icon-url.png"
        title="Shortened"
        description="Use any link, no matter what size, ShortURL always shortens"
      />
      <FeatureBox
        iconSrc="/imgs/icon-secure.png"
        title="Secure"
        description="It is fast and secure, our service has HTTPS protocol and data encryption"
      />
      <FeatureBox
        iconSrc="/imgs/icon-statistics.png"
        title="Statistics"
        description="Check the number of clicks that your shortened URL received"
      />
      <FeatureBox
        iconSrc="/imgs/icon-unique.png"
        title="Reliable"
        description="All links that try to disseminate spam, viruses and malware are deleted"
      />
      <FeatureBox
        iconSrc="/imgs/icon-responsive.png"
        title="Devices"
        description="Compatible with smartphones, tablets and desktop"
      />
    </div>
  );
}

export default FeatureBoxes;
