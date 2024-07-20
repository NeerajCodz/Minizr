import React, { useEffect, useState, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Admin.css';
import { FiHelpCircle } from "react-icons/fi";

function BannedHosts() {
  const [bannedHostsTable, setBannedHostsTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddHostsOpen, setIsAddHostsOpen] = useState(false); // State to control the AddHostsPopup
  const [newHost, setNewHost] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const pageSize = 10;

  const fetchBannedHosts = useCallback(async () => {
    try {
      const bannedHostsRef = collection(db, 'banned-hosts');
      const q = query(bannedHostsRef, orderBy('timestamp', 'desc'), limit(pageSize * currentPage));
      const querySnapshot = await getDocs(q);
      const bannedHostsData = [];
      querySnapshot.forEach((doc) => {
        bannedHostsData.push({ id: doc.id, ...doc.data() });
      });
      setBannedHostsTable(bannedHostsData);
    } catch (error) {
      console.error('Error fetching banned hosts:', error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchBannedHosts();
  }, [fetchBannedHosts]);

  const handleMorePage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleCollapsePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRemoveDocument = async (docId) => {
    try {
      await deleteDoc(doc(db, 'banned-hosts', docId));
      console.log('Banned host document deleted successfully:', docId);
      setCurrentPage(1);
      // Reload the table by fetching the updated data
      await fetchBannedHosts(currentPage);
    } catch (error) {
      console.error('Error deleting banned host document:', error);
    }
  };

  const openAddHostsPopup = () => {
    setIsAddHostsOpen(true);
  };

  const closeAddHostsPopup = () => {
    setIsAddHostsOpen(false);
    setNewHost('');
    setErrorMessage('');
  };

  const handleAddHost = async () => {
    try {
      if (!newHost) {
        setErrorMessage('Please enter a host.');
        return;
      }

      // Use newHost as the document name
      const newHostName = newHost.trim(); // Trim any whitespace from the input
      const docRef = doc(db, 'banned-hosts', newHostName);

      // Add a timestamp field to the document
      await setDoc(docRef, { timestamp: serverTimestamp() });

      // Refresh the banned hosts table by calling fetchBannedHosts
      await fetchBannedHosts();

      setNewHost('');
      closeAddHostsPopup(); // Close the popup
    } catch (error) {
      console.error('Error adding new host:', error);
      setErrorMessage('Error adding new host.');
    }
  };

  return (
    <section className='Admin-dashboard'>
      <div className='Admin-table'>
        <h1>BANNED HOSTS</h1>
        {bannedHostsTable.length === 0 ? (
          <div className='NothingFound'>
            <FiHelpCircle className='icon'/>
            <p style={{ textAlign: 'center' }}>No hosts banned found...</p>
          </div>
        ) : (
          <table className='popup-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Host</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bannedHostsTable.map((host) => (
                <tr key={host.id}>
                  <td>{host.timestamp.toDate().toLocaleDateString()}</td>
                  <td>{host.id}</td>
                  <td>
                    <button className='more-btn' onClick={() => handleRemoveDocument(host.id)}>Remove</button>
                  </td>
                </tr>
        ))}
            </tbody>
          </table>
           )}
        {bannedHostsTable.length > 0 && (
          <div className='button-container'>
            {currentPage > 1 ? (
              <button className='prev-btn' onClick={handleCollapsePage}>Collapse</button>
            ) : (
              <button className='prev-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>Collapse</button>
            )}
            {bannedHostsTable.length === pageSize * currentPage ? (
              <button className='next-btn' onClick={handleMorePage}>More</button>
            ) : (
              <button className='next-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>More</button>
            )}
          </div>
        )} 
        <button className='danger-btn' style={{marginTop: '15px',backgroundColor: '#cc2222', boxShadow: '0 5px 6px rgba(0, 0, 0, 0.2)'}} onClick={openAddHostsPopup}>ADD HOSTS</button>
        
        {/* Render AddHostsPopup if isAddHostsOpen is true */}
        {isAddHostsOpen && (
          <div className="popup">
            <div className="popup-content">
              <button className="close" onClick={closeAddHostsPopup}>&times;</button>
              <h2>Add Hosts</h2>
              <input
                type="text"
                value={newHost}
                onChange={(e) => setNewHost(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddHost();
                  }
                }}
                placeholder="Enter new host"
                required
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="button-container">
                <button className="cancel-btn" onClick={closeAddHostsPopup}>Cancel</button>
                <button className="submit-btn" onClick={handleAddHost}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BannedHosts;
