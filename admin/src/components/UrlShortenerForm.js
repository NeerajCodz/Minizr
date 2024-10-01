import React, { useState } from 'react';
import '../styles/Home.css';
import { generateShortCode } from '../utils/generateShortCode';
import { generateAnalyticsID } from '../utils/generateAnalyticsID';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../services/firebase';
import BannedHosts from '../utils/getHosts'; // Import the BannedHosts component
import logo from '../images/logo.png';
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

function UrlShortenerForm() {
  const [shortcode, setShortcode] = useState('');
  const [AnalyticsID, setAnalyticsID] = useState('');
  const [LongURL, setLongUrl] = useState('');
  const [customShortCode, setCustomShortCode] = useState('');
  const [result, setResult] = useState('');
  const [redirectToAnalytics, setRedirectToAnalytics] = useState(false);
  const [showExpandedFields, setShowExpandedFields] = useState(false);
  const [customAnalyticsID, setCustomAnalyticsID] = useState('');
  const [askBeforeRedirecting, setAskBeforeRedirecting] = useState(false);

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

      try {
        const docRef = doc(db, 'forbidden-shortcodes', shortcode);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          setResult(`The custom shortcode is forbidden.`);
          return;
        }
      } catch (error) {
        console.error('Error checking banned domains:', error);
      }

      try {
        const querySnapshot = await getDocs(collection(db, 'restricted-shortcodes'));
        const restrictedWords = []; // Array to store restricted words
        querySnapshot.forEach((doc) => {
          restrictedWords.push(doc.id.toLowerCase()); // Store each restricted word in lowercase
        });
      
        // Check if any restricted word is present in the custom shortcode
        const containsRestrictedWord = restrictedWords.some(word =>
          shortcode.toLowerCase().includes(word)
        );
      
        if (containsRestrictedWord) {
          setResult(`The custom shortcode contains restricted words.`);
          return; // Exit the function early
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
           

    } else {
      shortcode = generateShortCode();
    }

    const timestamp = new Date();
    analyticsID = customAnalyticsID || generateAnalyticsID();
    setAnalyticsID(analyticsID);

    const addUrlToFirestore = async (LongURL, shortCode, AnalyticsID, timestamp, CreatorIP ) => {
      try {
        const urlRef = doc(db, 'urls', shortCode); // Reference to the document with the shortcode
        await setDoc(urlRef, {
          LongURL: LongURL,
          AnalyticsID: (AnalyticsID) ? AnalyticsID : '',
          timestamp: timestamp,
          Clicks: 0,
          CreatorIP : CreatorIP,
          AskBeforeRedirect: askBeforeRedirecting,
          Enabled : true,
        });
        console.log('URL added to Firestore:', { LongURL, shortCode, timestamp });
        return true; // Return true if successful
      } catch (error) {
        console.error('Error adding URL to Firestore:', error);
        return false; // Return false if an error occurs
      }
    };    

    try {
      const addedSuccessfully = await addUrlToFirestore(LongURL, shortcode, analyticsID, timestamp, CreatorIP, askBeforeRedirecting);
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

  const toggleExpandFields = () => {
    setShowExpandedFields(!showExpandedFields);
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
            {showExpandedFields && (
              <>
                <input
                  type="text"
                  value={customAnalyticsID}
                  onChange={(e) => setCustomAnalyticsID(e.target.value)}
                  placeholder="Custom AnalyticsID (optional)"
                />
                <div className="switch-container">
                  <div className="switch-label">Ask before redirect</div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={askBeforeRedirecting}
                      onChange={(e) => setAskBeforeRedirecting(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </>
            )}
            <button className="advance-btn" onClick={(e) => {toggleExpandFields(); e.preventDefault();}}>
              {showExpandedFields ? (
                <>
                  Collapse <IoIosArrowUp />
                </>
              ) : (
                <>
                  Advanced <IoIosArrowDown /> 
                </>
              )}
            </button>
            {result && <p className="result-message">{result}</p>}  

            <button>Shorten URL</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UrlShortenerForm;