import React, { useEffect, useState } from 'react';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Analytics.css'; // Import CSS for analytics
import '../../styles/Home.css';
import GetClients from '../../utils/getClients';

const AnalyticsDisplay = ({ shortcode, AnalyticsID }) => {
  const clients = GetClients();
  const [LongURL, setLongURL] = useState('');
  const [Clicks, setClicks] = useState('');
  const [Enabled, setEnabled] = useState('');
  const [AskBeforeRedirect, setAskBeforeRedirect] = useState('');
  const [isDeleteLinkOpen, setIsDeleteLinkOpen] = useState(false);
  const [isDisableLinkOpen, setIsDisableLinkOpen] = useState(false);
  const [isClearLinkDataOpen, setIsClearLinkDataOpen] = useState(false);
  const [timestamp, setTimeStamp] = useState('');
  const [isChecked, setIsChecked] = useState(false); // State for checkbox

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const docRef = doc(db, 'urls', shortcode);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const { LongURL, Clicks,  Enabled, timestamp, AskBeforeRedirect } = docSnapshot.data();
          const dateObject = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object
          setTimeStamp(dateObject.toString());
          setLongURL(LongURL);
          setClicks(Clicks);
          setEnabled(Enabled);
          setAskBeforeRedirect(AskBeforeRedirect);
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
    <div className='fields'>
      <table className='analytics-table' >
        <tbody>
          <tr>
            <td><span className="question-fields">Created At:</span></td>
            <td><span className="answer-fields">{timestamp}</span></td>
          </tr>
          <tr>
            <td><span className="question-fields">Long URL:</span></td>
            <td style={{ maxWidth: '100px', wordBreak: 'break-all' }}>

              <a className='link' href={LongURL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {(LongURL)}
              </a>
            </td>
          </tr>
          <tr>
            <td><span className="question-fields">No of Clicks:</span></td>
            <td><span className="field-click">{Clicks}</span></td>
          </tr>
          <tr>
            <td><span className="question-fields">Shortcode:</span></td>
            <td><span className="answer-fields">{shortcode}</span></td>
          </tr>
          <tr>
            <td><span className="question-fields">Ask Before Redirect:</span></td>
            <td><span className="answer-fields">{AskBeforeRedirect ? "True" : "False"}</span></td>
          </tr>
          <tr>
            <td><span className="question-fields">Analytics ID:</span></td>
            <td><span className="answer-fields">{AnalyticsID}</span></td>
          </tr>
        </tbody>
      </table>
      <button className='submit-btn' style={{marginTop: '15px', boxShadow: '0 5px 6px rgba(0, 0, 0, 0.2)'}} onClick={handleCopyTrackLink}>Copy Track Link</button>
    </div>
  );
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

  const handleClear = async () => {
    try {
      const docRef = doc(db, 'urls', shortcode);
      await updateDoc(docRef, { Clicks: 0 });
      window.location.href = `/analytics?shortcode=${shortcode}&AnalyticsID=${AnalyticsID}`;
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };
  
  const handleDisableEnable = async () => {
    try {
      const docRef = doc(db, 'urls', shortcode);
      if (Enabled) {
        // If it's currently enabled, disable it
        await updateDoc(docRef, { Enabled: false });
      } else {
        // If it's currently disabled, enable it
        await updateDoc(docRef, { Enabled: true });
      }
  
      // Redirect after updating the document
      window.location.href = `/analytics?shortcode=${shortcode}&AnalyticsID=${AnalyticsID}`;
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };  

  const openDeleteLinkPopup = () => {
    setIsDeleteLinkOpen(true);
  };
  const closeDeleteLinkPopup = () => {
    setIsDeleteLinkOpen(false);
    setIsChecked(false);
  };
  const openDisableLinkPopup = () => {
    setIsDisableLinkOpen(true);
  };
  const closeDisableLinkPopup = () => {
    setIsDisableLinkOpen(false);
    setIsChecked(false);
  };
  const openClearLinkDataPopup = () => {
    setIsClearLinkDataOpen(true);
  };
  const closeClearLinkDataPopup = () => {
    setIsClearLinkDataOpen(false);
    setIsChecked(false);
  };

  return (
      <>
        <section className="Link-section">
          <h1>LINKS</h1>
          <table className='link-table'>
            <thead>
              <tr>
                <th>URL</th>
                <th>Copy</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={index}>
                  <td>
                    <a href={`https://${client}/${shortcode}`} target="_blank" rel="noopener noreferrer">
                      https://{client}/{shortcode}
                    </a>
                  </td>
                  <td>
                    <button onClick={(e) => handleCopy(client, shortcode, e)} style={{ marginRight: '5px' }}>
                      Copy
                    </button>
                  </td>
                  <td>
                    <button onClick={(e) => handleShare(client, shortcode, e)}>
                      Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </section>
        <section className="Analytics-section">
          <h1>Analytics</h1>
          {AnalyticsTable}
        </section>
        <section className="Danger-Section">
          <div className="danger-zone">
            <h1>Danger Zone</h1>
            <table className="danger-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Description</th>
                    <th>Confirm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="question-fields">Link Status</span></td>
                    <td>
                      <span className="answer-fields">
                        {Enabled ? 'Link is enabled' : 'Link is disabled'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={Enabled ? "danger-btn" : "submit-btn"} 
                        onClick={() => { 
                          if (Enabled) {
                            openDisableLinkPopup();
                          } else {
                            openDisableLinkPopup();
                          }
                        }}
                      >
                      {Enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                  <tr>
                      <td><span className="question-fields">Delete Link</span></td>
                      <td><span className="answer-fields">Permanently remove your link and data</span></td>
                      <td><button className="danger-btn" onClick={openDeleteLinkPopup} >Delete</button></td>
                  </tr>
                  <tr>
                      <td><span className="question-fields">Clear Link Data</span></td>
                      <td><span className="answer-fields">Clear data of your link.</span></td>
                      <td><button className="danger-btn" onClick={openClearLinkDataPopup} >Clear</button></td>
                  </tr>
                </tbody>
            </table>
        </div>

          {isDeleteLinkOpen && (
            <div className="popup">
              <div className="popup-content">
                <button className="close" onClick={closeDeleteLinkPopup}>&times;</button>
                <h2>Delete this short link?</h2>
                <div className='delete-checkbox'>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
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
            </div>
          )}
          {isDisableLinkOpen && (
            <div className="popup">
              <div className="popup-content">
                <button className="close" onClick={closeDisableLinkPopup}>&times;</button>
                <h2>
                  {Enabled ? "Disable this link Temporarily?" : "Enable this link?"}
                </h2>
                <div className='delete-btn-div'>
                  <button
                    className={Enabled ? "delete-button" : "submit-button"}
                    onClick={handleDisableEnable}
                  >
                    {Enabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {isClearLinkDataOpen && (
            <div className="popup">
              <div className="popup-content">
                <button className="close" onClick={closeClearLinkDataPopup}>&times;</button>
                <h2>Clear analytics data of this short link?</h2>
                <div className='delete-checkbox'>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <span>I understand that this action can't be reversed</span>
                </div>
                <div className='delete-btn-div'>
                  <button
                    className="delete-button"
                    onClick={handleClear}
                    disabled={!isChecked}
                    style={{ backgroundColor: isChecked ? 'red' : 'lightcoral' }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </>
    );
    
  
  
};

export default AnalyticsDisplay;
