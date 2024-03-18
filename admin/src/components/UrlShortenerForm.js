import React, { useState } from 'react';
import '../styles/Home.css';
import { addUrlToFirestore } from '../services/firestoreService';
import { generateShortCode } from '../utils/generateShortCode';
import { generateAnalyticsID } from '../utils/generateAnalyticsID';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import BannedHosts from '../utils/getHosts'; // Import the BannedHosts component
import logo from '../images/logo.png';

function UrlShortenerForm() {
  const [shortcode, setShortcode] = useState('');
  const [AnalyticsID, setAnalyticsID] = useState('');
  const [LongURL, setLongUrl] = useState('');
  const [customShortCode, setCustomShortCode] = useState('');
  const [result, setResult] = useState('');
  const [redirectToAnalytics, setRedirectToAnalytics] = useState(false);

  const {CreatorIP} = BannedHosts();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract domain from LongURL
    let domain = '';
    let analyticsID="AID";
    const protocolIndex = LongURL.indexOf('://');
    if (protocolIndex > -1) {
      const domainStartIndex = protocolIndex + 3; // Length of '://'
      const domainEndIndex = LongURL.indexOf('/', domainStartIndex);
      if (domainEndIndex > -1) {
        domain = LongURL.substring(domainStartIndex, domainEndIndex);
      } else {
        domain = LongURL.substring(domainStartIndex);
      }
    }
    
    // Check if the domain exists in the banned-domains collection
    try {
      const docRef = doc(db, 'banned-domains', domain);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setResult(`The domain ${domain} is not allowed.`);
        return;
      }
    } catch (error) {
      console.error('Error checking banned domains:', error);
    }

    // Proceed with shortening the URL if the domain is allowed
    let shortcode = customShortCode.trim();
    if (shortcode) {
      const isValidCustomShortCode = /^[A-Z0-9-]+$/i.test(shortcode);
      if (!isValidCustomShortCode) {
        setResult('Invalid custom short shortcode. It should only contain alphabets, numbers, and hyphens.');
        return;
      }

      const docSnapshot = await getDoc(doc(db, 'urls', shortcode));
      setShortcode(shortcode)
      if (docSnapshot.exists()) {
        setResult('Custom short shortcode already exists. Please choose a different one.');
        return;
      }
    } else {
      shortcode = generateShortCode();
    }

    const timestamp = new Date();
    analyticsID = generateAnalyticsID();
    setAnalyticsID(analyticsID);

    try {
      const addedSuccessfully = await addUrlToFirestore(LongURL, shortcode, analyticsID, timestamp, CreatorIP);

      if (addedSuccessfully) {
        setRedirectToAnalytics(true);
      } else {
        setResult('Failed to create short link. Please retry.');
      }
    } catch (error) {
      console.error('Error adding document:', error);
      setResult('Failed to create short link. Please retry.');
    }
  }; 

  if (redirectToAnalytics) {
    const analyticsURL = `/analytics?shortcode=${encodeURIComponent(shortcode)}&AnalyticsID=${encodeURIComponent(AnalyticsID)}`;
    // Redirect to the constructed URL
    window.location.href = analyticsURL;
  }
 
  return (
  <div>
      <div className="container">
        <img src={logo} alt="Logo" className="logo" />
        <p className="text">Use our URL shortener to convert your long url to small urls and track them.</p>
        <div className='formbox'>
          <form onSubmit={handleSubmit}>
            <input
              type="url"
              value={LongURL}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter long URL"
              required
            />
            <input
              type="text"
              value={customShortCode}
              onChange={(e) => setCustomShortCode(e.target.value)}
              placeholder="Custom shortcode (optional)"
            />
            {result && <p className="result-message">{result}</p>}
            <button >Shorten URL</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UrlShortenerForm;
