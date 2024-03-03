import React, { useState } from 'react';
import { doc, addDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';

const UrlPopup = ({ isOpen, onClose, details, onDelete, onBan }) => {
  
  // State to manage confirmation popup
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  if (!isOpen || !details) return null;

  // Function to format timestamp into time string
  const getTime = (timestamp) => {
    if (!timestamp) return "NaN";
    return timestamp.toDate().toLocaleTimeString();
  };

  // Function to format timestamp into date string
  const getDate = (timestamp) => {
    if (!timestamp) return "NaN";
    return timestamp.toDate().toLocaleDateString();
  };

  // Function to handle delete button click
  const handleDelete = () => {
    setConfirmationAction('delete');
    setIsConfirmationOpen(true);
  };

  // Function to handle ban button click
  const handleBan = () => {
    setConfirmationAction('ban');
    setIsConfirmationOpen(true);
  };

  // Function to handle ban user button click
  const handleBanUser = () => {
    setConfirmationAction('banUser');
    setIsConfirmationOpen(true);
  };

  // Function to confirm action and perform corresponding action
  const confirmAction = async () => {
    if (confirmationAction === 'delete') {
      onDelete(details.id); // Delete the document
    } else if (confirmationAction === 'ban') {
      onBan(details.id); // Ban the document
      try {
        // Add IP to banned-hosts collection
        const bannedHostsRef = collection(db, 'banned-hosts');
        await addDoc(bannedHostsRef, { [details.CreatorIP]: true });
        console.log('IP banned successfully:', details.CreatorIP);
      } catch (error) {
        console.error('Error banning IP:', error);
      }
    } else if (confirmationAction === 'banUser') {
      try {
        // Ban the user by setting banned flag in banned-hosts collection
        const bannedHostsRef = collection(db, 'banned-hosts');
        const docRef = doc(bannedHostsRef, details.CreatorIP);
        await setDoc(docRef, { banned: true });
        console.log('User banned successfully:', details.CreatorIP);
      } catch (error) {
        console.error('Error banning user:', error);
      }
    }
    onClose(); // Close the popup
    setIsConfirmationOpen(false); // Close the confirmation popup
  };

  // Function to cancel action and close the confirmation popup
  const cancelAction = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <button className="close" onClick={onClose}>X</button>
        <table className="popup-table">
          <tbody>
            <tr>
              <td>Time:</td>
              <td>{getTime(details.timestamp)}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td>{getDate(details.timestamp)}</td>
            </tr>
            <tr>
              <td>Document Name:</td>
              <td>{details.id || "NaN"}</td>
            </tr>
            <tr>
              <td>Long URL:</td>
              <td><a href={details.LongURL} target="_blank" rel="noopener noreferrer">{details.LongURL}</a></td>
            </tr>
            <tr>
              <td>IP:</td>
              <td>{details.CreatorIP || "NaN"}</td>
            </tr>
            <tr>
              <td>AnalyticsID:</td>
              <td>{details.AnalyticsID || "NaN"}</td>
            </tr>
            <tr>
              <td>Clicks:</td>
              <td>{details.Clicks || "NaN"}</td>
            </tr>
          </tbody>
        </table>
        <div className="button-container">
          {/* Button to handle delete action */}
          <button onClick={handleDelete} style={{ backgroundColor: '#cc2222' }}>Delete Link</button>
          {/* Button to handle ban action */}
          <button onClick={handleBan} >Ban Link</button>
          {/* Button to handle ban user action */}
          <button onClick={handleBanUser} >Ban User</button>
        </div>
        {/* Confirmation popup */}
        {isConfirmationOpen && (
          <div className="confirmation-popup">
            <p>Are you sure about this action? It can't be undone.</p>
            <div className='button-container'>
              {/* Button to confirm action */}
              <button style={{ backgroundColor: '#cc2222' }} onClick={confirmAction}>Yes</button>
              {/* Button to cancel action */}
              <button onClick={cancelAction}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlPopup;
