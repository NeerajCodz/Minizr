import React, { useState } from 'react';
import '../css/Form.css';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import AnalyticsDisplay from './AnalyticsDisplay'; // Import the second component for redirection
import Header from './Header'; // Import the Header component
import Footer from './Footer'; // Import the Footer component

function AnalyticsForm() {
  const [shortcode, setShortcode] = useState('');
  const [analyticsid, setAnalyticsid] = useState('');
  const [redirectToAnalytics, setRedirectToAnalytics] = useState(false); // State to handle redirection
  const [errorMessage, setErrorMessage] = useState(''); // State to store error message

  const handleSubmit = async (e) => {
    e.preventDefault();

    let extractedShortcode = '';

    // Check if the input contains a valid URL
    try {
      const url = new URL(shortcode);
      const pathname = url.pathname; // Extract the pathname from the URL
      extractedShortcode = pathname.substr(1); // Remove the leading "/"
    } catch (error) {
      // If it's not a valid URL, assume it's already a shortcode
      extractedShortcode = shortcode;
    }

    // Use the extracted shortcode for further processing

    // Check if the processed shortcode exists as a document in the Firestore collection
    const docRef = doc(db, 'urls', extractedShortcode);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      // If the document exists, compare the AnalyticsID field with the provided analyticsid
      const analyticsIDFromDatabase = docSnapshot.data().AnalyticsID;

      if (analyticsIDFromDatabase === analyticsid) {
        // Redirect to AnalyticsDisplay component with extracted shortcode and analytics id
        setRedirectToAnalytics(true);
      } else {
        // Set error message if AnalyticsID does not match
        setErrorMessage('AnalyticsID does not match');
      }
    } else {
      // Set error message if Shortcode does not exist in the database
      setErrorMessage('Shortcode does not exist in the database');
    }
  };

  if (redirectToAnalytics) {
    return <AnalyticsDisplay shortcode={shortcode} analyticsid={analyticsid} />;
  }

  return (
    <div>
      <Header/>
      <div className='formbox'>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            placeholder="SHORTURL OR SHORTCODE"
            required
          />
          <input
            type="text"
            value={analyticsid}
            onChange={(e) => setAnalyticsid(e.target.value)}
            placeholder="Custom shortcode (optional)"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Show Analytics</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default AnalyticsForm;
