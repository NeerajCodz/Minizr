import React from 'react';
import '../styles/FeatureBox.css'; // Import CSS file for styling
import LikeIcon from '../images/icons/like.png';
import ResponsiveIcon from '../images/icons/responsive.png';
import SecureIcon from '../images/icons/secure.png';
import StatisticsIcon from '../images/icons/statistics.png';
import UniqueIcon from '../images/icons/unique.png';
import UrlIcon from '../images/icons/url.png';

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
        iconSrc={LikeIcon}
        title="Easy"
        description="ShortURL is easy and fast, enter the long link to get your shortened link"
      />
      <FeatureBox
        iconSrc={UrlIcon}
        title="Shortened"
        description="Use any link, no matter what size, ShortURL always shortens"
      />
      <FeatureBox
        iconSrc={SecureIcon}
        title="Secure"
        description="It is fast and secure, our service has HTTPS protocol and data encryption"
      />
      <FeatureBox
        iconSrc={StatisticsIcon}
        title="Statistics"
        description="Check the number of clicks that your shortened URL received"
      />
      <FeatureBox
        iconSrc={UniqueIcon}
        title="Reliable"
        description="All links that try to disseminate spam, viruses and malware are deleted"
      />
      <FeatureBox
        iconSrc={ResponsiveIcon}
        title="Devices"
        description="Compatible with smartphones, tablets and desktop"
      />
    </div>
  );
}

export default FeatureBoxes;
