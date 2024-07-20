import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore'; // Import updateDoc from Firestore
import { db } from '../../services/firebase';
import { SHA256 } from 'crypto-js'; // Import SHA256 from crypto-js
import URLDashboard from './UrlDashboard';
import BannedHosts from './BannedHosts';
import BannedDomains from './BannedDomains';
import Clients from './Clients';
import RestrictedShortcodes from './RestrictedShortcode';
import ForbiddenShortcodes from './ForbiddenShortcode';

function Portal() {
  const [newUsername, setNewUsername] = useState('');
  const [confirmUsername, setConfirmUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChangeUsernamePopupOpen, setChangeUsernamePopupOpen] = useState(false); // State for change username popup
  const [isChangePasswordPopupOpen, setChangePasswordPopupOpen] = useState(false); // State for change password popup

  const handleChangeUsername = async () => {
    try {
      if (newUsername !== confirmUsername) {
        setErrorMessage('New username and confirm username must match.');
        return;
      }

      const hashedUsername = SHA256(newUsername).toString();
      await updateDoc(doc(db, 'admin', 'login'), { username: hashedUsername });

      setChangeUsernamePopupOpen(false); // Close the popup
    } catch (error) {
      console.error('Error updating username:', error);
      setErrorMessage('Error updating username.');
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setErrorMessage('New password and confirm password must match.');
        return;
      }

      const hashedPassword = SHA256(newPassword).toString();
      await updateDoc(doc(db, 'admin', 'login'), { password: hashedPassword });

      setChangePasswordPopupOpen(false); // Close the popup
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage('Error updating password.');
    }
  };

  return (
    <main>
      <div className='button-container' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className='more-btn' onClick={() => setChangeUsernamePopupOpen(true)}>Change Username</button>
        <button className='more-btn' onClick={() => setChangePasswordPopupOpen(true)}>Change Password</button>
      </div>
      <URLDashboard />
      <BannedHosts />
      <BannedDomains />
      <Clients />
      <RestrictedShortcodes />
      <ForbiddenShortcodes />
      {isChangeUsernamePopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <button className="close" onClick={() => setChangeUsernamePopupOpen(false)}>
              &times;
            </button>
            <h2>Change Username</h2>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New username"
              required
            />
            <input
              type="text"
              value={confirmUsername}
              onChange={(e) => setConfirmUsername(e.target.value)}
              placeholder="Confirm New username"
              required
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="button-container">
              <button className="submit-btn" onClick={handleChangeUsername}>
                Submit
              </button>
              <button className="cancel-btn" onClick={() => setChangeUsernamePopupOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isChangePasswordPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <button className="close" onClick={() => setChangePasswordPopupOpen(false)}>
              &times;
            </button>
            <h2>Change Password</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='New Password'
              required
            />
            <input
              type="text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm New password'
              required
            />
            <div className="button-container">
              <button className="submit-btn" onClick={handleChangePassword}>
                Submit
              </button>
              <button className="cancel-btn" onClick={() => setChangePasswordPopupOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Portal;
