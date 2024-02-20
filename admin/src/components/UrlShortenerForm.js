import React, { useState } from 'react';
import '../css/Form.css';
import { addUrlToFirestore } from '../services/firestoreService';
import { generateShortCode } from '../utils/generateShortCode';
import { generateAnalyticsID } from '../utils/generateAnalyticsID';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import GetClients from './getClients';

function UrlShortenerForm() {
  const clients = GetClients();
  const [longUrl, setLongUrl] = useState('');
  const [customShortCode, setCustomShortCode] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract domain from longUrl
    let domain = '';
    const protocolIndex = longUrl.indexOf('://');
    if (protocolIndex > -1) {
      const domainStartIndex = protocolIndex + 3; // Length of '://'
      const domainEndIndex = longUrl.indexOf('/', domainStartIndex);
      if (domainEndIndex > -1) {
        domain = longUrl.substring(domainStartIndex, domainEndIndex);
      } else {
        domain = longUrl.substring(domainStartIndex);
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
      if (docSnapshot.exists()) {
        setResult('Custom short shortcode already exists. Please choose a different one.');
        return;
      }
    } else {
      shortcode = generateShortCode();
    }

    const timestamp = new Date();

    const analyticsID = generateAnalyticsID();

    try {
      const addedSuccessfully = await addUrlToFirestore(longUrl, shortcode, analyticsID, timestamp);

      if (addedSuccessfully) {
        const shortLinks = clients.map((client, index) => (
          <div key={index} className="result-message">
            <p>
              <a href={`https://${client}/${shortcode}`} target="_blank" rel="noopener noreferrer">
                https://{client}/{shortcode}
              </a>
            </p>
            <button className="copy-button" onClick={(e) => handleCopy(client, shortcode, e)}>Copy</button>
            <button className="share-button" onClick={(e) => handleShare(client, shortcode, e)}>Share</button>
          </div>
        ));
        setResult(shortLinks);
        // Clear form inputs on success
        setLongUrl('');
        setCustomShortCode('');
      } else {
        setResult('Failed to create short link. Please retry.');
      }
    } catch (error) {
      console.error('Error adding document:', error);
      setResult('Failed to create short link. Please retry.');
    }
  }; 

  const handleCopy = (client, shortcode, e) => {
    e.preventDefault(); // Prevent form submission
    // Create a temporary input element
    const tempInput = document.createElement('input');
    
    // Set the value of the input element to the short link
    tempInput.value = `https://${client}/${shortcode}`;
    
    // Append the input element to the document body
    document.body.appendChild(tempInput);
    
    // Select the value of the input element
    tempInput.select();
    
    // Execute the copy command
    document.execCommand('copy');
    
    // Remove the temporary input element from the document body
    document.body.removeChild(tempInput);
    
    const copyButton = document.getElementById('copyButton');
    if (copyButton) {
      // Change button text to indicate link has been copied
      copyButton.textContent = 'Copied!';
      // Disable the button to prevent multiple clicks
      copyButton.disabled = true;
    }
  };
  
  const handleShare = (client, shortcode, e) => {
    e.preventDefault(); // Prevent form submission
    // Define the URL to be shared
    const urlToShare = `https://${client}/${shortcode}`;
    
    // Check if the Web Share API is supported by the browser
    if (navigator.share) {
      // Share the URL using the Web Share API
      navigator.share({
        title: 'Share Short Link',
        text: 'Check out this short link!',
        url: urlToShare,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      // You can implement your own custom sharing logic here
      alert(`Share this link: ${urlToShare}`);
    }
  };

  return (
    <div className='formbox'>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={longUrl}
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
        {result}
        <button type="submit">Shorten URL</button>
      </form>
    </div>
  );
}

export default UrlShortenerForm;
