import React, { useEffect, useState } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Header from '../Header';
import '../../styles/Analytics.css'; // Import CSS for analytics
import '../../styles/Home.css';
import GetClients from '../../utils/getClients';
import trimUrl from '../../utils/trimUrl';

const AnalyticsDisplay = ({ shortcode, AnalyticsID }) => {
  const clients = GetClients();
  const [LongURL, setLongURL] = useState('');
  const [Clicks, setClicks] = useState('');
  const [timestamp, setTimeStamp] = useState('');
  const [isChecked, setIsChecked] = useState(false); // State for checkbox

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const docRef = doc(db, 'urls', shortcode);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const { LongURL, Clicks, timestamp } = docSnapshot.data();
          const dateObject = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object
          setTimeStamp(dateObject.toString());
          setLongURL(LongURL);
          setClicks(Clicks);
        } else {
          console.log('Document does not exist');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [shortcode]);

  const handleCopyTrackLink = () => {
    const trackLink = `${window.location.origin}/analytics?shortcode=${shortcode}&AnalyticsID=${AnalyticsID}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(trackLink)
        .then(() => alert('Tracking link copied to clipboard'))
        .catch(error => console.error('Error copying to clipboard:', error));
    } else {
      console.error('Clipboard API not supported');
    }
  };
  

  const AnalyticsTable = (
    <div className='fields' style={{ marginTop : "50px" }}>
      <table className='analytics-table' >
        <tbody>
          <tr>
            <td><span className="question-fields">Created At:</span></td>
            <td>{timestamp}</td>
          </tr>
          <tr>
            <td><span className="question-fields">Long URL:</span></td>
            <td style={{ maxWidth: '100px', wordBreak: 'break-all' }}>

              <a href={LongURL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {trimUrl(LongURL)}
              </a>
            </td>
          </tr>
          <tr>
            <td><span className="question-fields">No of Clicks:</span></td>
            <td><span className="field-click">{Clicks}</span></td>
          </tr>
          <tr>
            <td><span className="question-fields">Shortcode:</span></td>
            <td>{shortcode}</td>
          </tr>
          <tr>
            <td><span className="question-fields">Analytics ID:</span></td>
            <td>{AnalyticsID}</td>
          </tr>
          <tr>
          <td></td>
          <td><button className="copy-track-link-button" onClick={handleCopyTrackLink}>Copy Track Link</button></td>
          </tr>
        </tbody>
      </table>
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
      // Disable the button to prevent multiple Clicks
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
    <main>
    <Header/>
    <div className='main'>
      {AnalyticsTable}
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
    </div>
    </main>
  );
};

export default AnalyticsDisplay;
