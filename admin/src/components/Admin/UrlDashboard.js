import React, { useEffect, useState } from 'react';
import { doc, collection, query, orderBy, limit, getDocs, deleteDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../services/firebase';
import { IoMdCopy } from "react-icons/io";
import '../../styles/Admin.css';
import trimUrl from '../../utils/trimUrl';
import { FiHelpCircle } from "react-icons/fi";


const URLDashboard = () => {
  const [urlsTable, setUrlsTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupDetails, setPopupDetails] = useState(null);
  const [copyClicked, setCopyClicked] = useState(false); 
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isIPBanned, setIsIPBanned] = useState(false); // State to track if the IP is banned
  const pageSize = 10;

  useEffect(() => {
    fetchUrls(currentPage);
  }, [currentPage]);

  const fetchUrls = async (page) => {
    try {
      const urlsRef = collection(db, 'urls');
      const q = query(urlsRef, orderBy('timestamp', 'desc'), limit(pageSize * page));
      const querySnapshot = await getDocs(q);
      const urlsData = [];
      querySnapshot.forEach((doc) => {
        urlsData.push({ id: doc.id, ...doc.data() });
      });
      setUrlsTable(urlsData);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleCollapsePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleMorePage = () => {
    setCurrentPage(currentPage + 1);
  };

  const openPopup = (details) => {
    console.log(details);
    setPopupDetails(details);
    checkIPBanned(details.CreatorIP);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(popupDetails.LongURL); // Copy the long URL to clipboard
    setCopyClicked(true); // Update state to indicate copy icon is clicked
  };

  const closePopup = () => {
    setPopupDetails(null);
    setIsConfirmationOpen(false);
  };

  const getTime = (timestamp) => {
    if (!timestamp) return 'NaN';
    return timestamp.toDate().toLocaleTimeString();
  };

  const getDate = (timestamp) => {
    if (!timestamp) return 'NaN';
    return timestamp.toDate().toLocaleDateString();
  };

  // Function to check if the IP is banned
  const checkIPBanned = async (CreatorIP) => {
    try {
      const bannedHostsRef = collection(db, 'banned-hosts');
      const q = query(bannedHostsRef);
      const querySnapshot = await getDocs(q);
      let isBanned = false; // Initialize a variable to track if the IP is banned
      querySnapshot.forEach((doc) => {
        if (doc.id === CreatorIP) {
          isBanned = true; // Set isBanned to true if the IP is found and is banned
        }
      });
      setIsIPBanned(isBanned); // Update the state based on whether the IP is banned or not
    } catch (error) {
      console.error('Error checking if IP is banned:', error);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await deleteDoc(doc(db, 'urls', docId));
      console.log('Document deleted successfully:', docId);
      fetchUrls(currentPage);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleBanDocument = async (docId) => {
    try {
      const docRef = doc(db, 'urls', docId);
      await updateDoc(docRef, { Banned: true });
      console.log('Document banned successfully:', docId);
      fetchUrls(currentPage);
    } catch (error) {
      console.error('Error banning document:', error);
    }
  };

  const handleUnbanDocument = async (docId) => {
    try {
      const docRef = doc(db, 'urls', docId);
      await updateDoc(docRef, { Banned: false });
      console.log('Document Unbanned successfully:', docId);
      fetchUrls(currentPage);
    } catch (error) {
      console.error('Error Unbanning document:', error);
    }
  };

  const handleBanUser = async () => {
    try {
      const bannedHostsRef = collection(db, 'banned-hosts');
      const docRef = doc(bannedHostsRef, popupDetails.CreatorIP);
      await setDoc(docRef, { timestamp: serverTimestamp() });
      console.log('IP banned successfully:', popupDetails.CreatorIP);
    } catch (error) {
      console.error('Error banning user:', error);
    }
    setIsConfirmationOpen(false);
    onClose();
  };

  const handleUnbanUser = async () => {
    try {
      const bannedHostsRef = collection(db, 'banned-hosts');
      const docRef = doc(bannedHostsRef, popupDetails.CreatorIP);
      await deleteDoc(docRef); // Delete the document corresponding to the IP from banned-hosts collection
      console.log('IP unbanned successfully:', popupDetails.CreatorIP);
      setIsIPBanned(false); // Update the state to reflect that the IP is unbanned
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
    setIsConfirmationOpen(false);
    onClose();
  };

  const confirmAction = async () => {
    if (confirmationAction === 'delete') {
      await handleDeleteDocument(popupDetails.id);
      fetchUrls(currentPage); // Refresh the URL table
    } else if (confirmationAction === 'ban') {
      await handleBanDocument(popupDetails.id);
      fetchUrls(currentPage); // Refresh the URL table
    } else if (confirmationAction === 'banUser') {
      await handleBanUser();
      fetchUrls(currentPage); // Refresh the URL table
    }
  
    // Close the popup after confirming the action
    fetchUrls(currentPage);
    closePopup();
  
    // Close the confirmation box after confirming the action
    setIsConfirmationOpen(false);
  };
  
  const cancelAction = () => {
    setIsConfirmationOpen(false);
  };

  const handleDelete = () => {
    setConfirmationAction('delete');
    setIsConfirmationOpen(true);
  };

  const handleBan = () => {
    if (popupDetails.Banned) {
      handleUnbanDocument(popupDetails.id); // If already banned, trigger Unban
      fetchUrls(currentPage);
      closePopup();
    } else {
      setConfirmationAction('ban'); // If not banned, trigger Ban
      setIsConfirmationOpen(true);
    }
  };

  const handleBanUserClick = () => {
    if (isIPBanned) {
      handleUnbanUser();
      fetchUrls(currentPage);
      closePopup(); // If IP is banned, unban it
    } else {
      setConfirmationAction('banUser');
      setIsConfirmationOpen(true); // If IP is not banned, show confirmation popup to ban it
    }
  };

  const onClose = () => {
    setIsConfirmationOpen(false);
  };
  

  return (
    <section className='Admin-dashboard'>
      <div className='Admin-table'>
        <h1>URL DASHBOARD</h1>
        {urlsTable.length === 0 ? (
          <div className='NothingFound'>
            <FiHelpCircle className='icon'/>
            <p style={{ textAlign: 'center' }}>No hosts banned yet...</p>
          </div>
        ) : (
          <table className='popup-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Shortcode</th>
                <th>Long URL</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {urlsTable.map((url) => (
                <tr key={url.id}>
                  <td>{getDate(url.timestamp)}</td>
                  <td>{url.id}</td>
                  <td><a href={url.LongURL} target="_blank" rel="noopener noreferrer">{trimUrl(url.LongURL)}</a></td>
                  <td><button className='more-btn' onClick={() => openPopup(url)}>More</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {urlsTable.length > 0 && (
          <div className='button-container'>
          {currentPage > 1 ? (
            <button className='prev-btn' onClick={handleCollapsePage}>Collapse</button>
          ) : (
            <button className='prev-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>Collapse</button>
          )}

          {urlsTable.length === pageSize * currentPage ? (
            <button className='next-btn' onClick={handleMorePage}>More</button>
          ) : (
            <button className='next-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>More</button>
          )}
          </div>
        )}

        {popupDetails && (
          <div className="popup">
            <div className="popup-content">
              <button className="close" onClick={closePopup}>X</button>
              <table className="popup-table">
                <tbody>
                  <tr>
                    <td>Time:</td>
                    <td>{getTime(popupDetails.timestamp)}</td>
                  </tr>
                  <tr>
                    <td>Date:</td>
                    <td>{getDate(popupDetails.timestamp)}</td>
                  </tr>
                  <tr>
                    <td>Shortcode:</td>
                    <td>{popupDetails.id || "NaN"}</td>
                  </tr>
                  <tr>
                    <td>Long URL <IoMdCopy onClick={copyToClipboard} style={{ color: copyClicked ? 'green' : 'black' }} /></td>
                    <td>
                    <a href={popupDetails.LongURL} target="_blank" rel="noopener noreferrer">
                      {trimUrl(popupDetails.LongURL)}
                    </a>
                    </td>
                  </tr>
                  <tr>
                    <td>IP:</td>
                    <td>{popupDetails.CreatorIP || "NaN"}</td>
                  </tr>
                  <tr>
                    <td>AnalyticsID:</td>
                    <td>{popupDetails.AnalyticsID || "NaN"}</td>
                  </tr>
                  <tr>
                    <td>Clicks:</td>
                    <td>{popupDetails.Clicks || "NaN"}</td>
                  </tr>
                  <tr>
                    <td>Ask Before Redirect:</td>
                    <td>{popupDetails.AskBeforeRedirect ? "true" : "false"}</td>
                  </tr>
                  <tr>
                    <td>Banned:</td>
                    <td>{popupDetails.Banned ? "true" : "false"}</td>
                  </tr>
                </tbody>
              </table>
              <div className="button-container">
                <button onClick={handleDelete} className='cancel-btn'>Delete Link</button>
                <button onClick={handleBan} className='submit-btn'>
                    {popupDetails.Banned ? 'Unban Link' : 'Ban Link'}
                </button>
                <button onClick={handleBanUserClick} className='submit-btn'>
                    {isIPBanned ? 'Unban IP' : 'Ban IP'}
                </button>
              </div>
              {isConfirmationOpen && (
                <div className="confirmation-popup">
                  <p>Are you sure about this action?.</p>
                  <div className='button-container'>
                    <button onClick={cancelAction} className='submit-btn'>Cancel</button>
                    <button className='cancel-btn' onClick={confirmAction} onKeyDown={(e) => e.key === 'Enter' && confirmAction()}>Yes</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default URLDashboard;
