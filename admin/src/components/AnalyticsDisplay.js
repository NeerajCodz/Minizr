import React, { useEffect, useState } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../css/Analytics.css'; // Import CSS for analytics
import '../css/Form.css';
import GetClients from './getClients';
import Header from './Header'; // Import the Header component
import Footer from './Footer'; // Import the Footer component

const AnalyticsDisplay = ({ shortcode, analyticsid }) => {
  const clients = GetClients();
  const [longUrl, setLongUrl] = useState('');
  const [click, setClick] = useState('');
  const [timestamp, setTimeStamp] = useState('');
  const [isChecked, setIsChecked] = useState(false); // State for checkbox

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const docRef = doc(db, 'urls', shortcode);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const { longUrl, click, timestamp } = docSnapshot.data();
          const dateObject = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object
          setTimeStamp(dateObject.toString());
          setLongUrl(longUrl);
          setClick(click);
        } else {
          console.log('Document does not exist');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [shortcode]);

  const basicAnalytics = (
    <div className="basic-analytics">
      <div className="fields">
        <p><span className="question-fields">Created At:</span> <span className="answer-fields">{timestamp}</span></p>
        <p><span className="question-fields">Long URL:</span> <a href={longUrl} target="_blank" rel="noopener noreferrer" className="long-url">{longUrl}</a></p>
        <p><span className="question-fields">No of clicks:</span> <span className="answer-fields"><span className="field-click">{click}</span></span></p>
        <p><span className="question-fields">Shortcode:</span> <span className="answer-fields">{shortcode}</span></p>
        <p><span className="question-fields">Analytics ID:</span> <span className="answer-fields">{analyticsid}</span></p>
      </div>
    </div>
  );
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
  const handleDelete = async () => {
    try {
      const docRef = doc(db, 'urls', shortcode);
      await deleteDoc(docRef);
      window.location.href = '/'; // Redirect to home page after deletion
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  return (
    <div>
      <Header /> {/* Include the Header component */}
      {basicAnalytics}
      {shortLinks}
      <div className='delete-checkbox'>
        <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
        <span>I understand that this action can't be reversed</span>
      </div>
      <div className='delete-btn-div'>
        <button
          className="delete-button"
          onClick={handleDelete}
          disabled={!isChecked}
          style={{ backgroundColor: isChecked ? 'red' : 'lightcoral' }}
        >
          Delete
        </button>
      </div>
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default AnalyticsDisplay;
