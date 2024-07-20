import React, { useEffect, useState, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Admin.css';
import { FiHelpCircle } from "react-icons/fi";

function BannedDomains() {
  const [bannedDomainsTable, setBannedDomainsTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDomainsOpen, setIsAddDomainsOpen] = useState(false); // State to control the AddDomainsPopup
  const [newDomain, setNewDomain] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const pageSize = 10;

  const fetchBannedDomains = useCallback(async () => {
    try {
      const bannedDomainsRef = collection(db, 'banned-domains');
      const q = query(bannedDomainsRef, orderBy('timestamp', 'desc'), limit(pageSize * currentPage));
      const querySnapshot = await getDocs(q);
      const bannedDomainsData = [];
      querySnapshot.forEach((doc) => {
        bannedDomainsData.push({ id: doc.id, ...doc.data() });
      });
      setBannedDomainsTable(bannedDomainsData);
    } catch (error) {
      console.error('Error fetching banned domains:', error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchBannedDomains();
  }, [fetchBannedDomains]);

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
      await deleteDoc(doc(db, 'banned-domains', docId));
      console.log('Banned domain document deleted successfully:', docId);
      setCurrentPage(1);
      // Reload the table by fetching the updated data
      await fetchBannedDomains(currentPage);
    } catch (error) {
      console.error('Error deleting banned domain document:', error);
    }
  };

  const openAddDomainsPopup = () => {
    setIsAddDomainsOpen(true);
  };

  const closeAddDomainsPopup = () => {
    setIsAddDomainsOpen(false);
    setNewDomain('');
    setErrorMessage('');
  };

  const handleAddDomain = async () => {
    try {
      if (!newDomain) {
        setErrorMessage('Please enter a domain.');
        return;
      }

      // Use newDomain as the document name
      const newDomainName = newDomain.trim(); // Trim any whitespace from the input
      const docRef = doc(db, 'banned-domains', newDomainName);

      // Add a timestamp field to the document
      await setDoc(docRef, { timestamp: serverTimestamp() });

      // Refresh the banned domains table by calling fetchBannedDomains
      await fetchBannedDomains();

      setNewDomain('');
      closeAddDomainsPopup(); // Close the popup
    } catch (error) {
      console.error('Error adding new domain:', error);
      setErrorMessage('Error adding new domain.');
    }
  };

  return (
    <section className='Admin-dashboard'>
      <div className='Admin-table'>
        <h1>BANNED DOMAINS</h1>
        {bannedDomainsTable.length === 0 ? (
          <div className='NothingFound'>
            <FiHelpCircle className='icon'/>
            <p style={{ textAlign: 'center' }}>No domains banned found...</p>
          </div>
        ) : (
          <table className='popup-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Domains</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bannedDomainsTable.map((domain) => (
                <tr key={domain.id}>
                  <td>{domain.timestamp.toDate().toLocaleDateString()}</td>
                  <td>{domain.id}</td>
                  <td>
                    <button className='more-btn' onClick={() => handleRemoveDocument(domain.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {bannedDomainsTable.length > 0 && (
          <div className='button-container'>
            {currentPage > 1 ? (
              <button className='prev-btn' onClick={handleCollapsePage}>Collapse</button>
            ) : (
              <button className='prev-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>Collapse</button>
            )}

            {bannedDomainsTable.length === pageSize * currentPage ? (
              <button className='next-btn' onClick={handleMorePage}>More</button>
            ) : (
              <button className='next-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>More</button>
            )}
          </div>
        )}

        <button className='danger-btn' style={{marginTop: '15px',backgroundColor: '#cc2222', boxShadow: '0 5px 6px rgba(0, 0, 0, 0.2)'}} onClick={openAddDomainsPopup}>ADD DOMAINS</button>

        {/* Render AddDomainsPopup if isAddDomainsOpen is true */}
        {isAddDomainsOpen && (
          <div className="popup">
            <div className="popup-content">
              <button className="close" onClick={closeAddDomainsPopup}>&times;</button>
              <h2>Add Domains</h2>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddDomain();
                  }
                }}
                placeholder="Enter new domain"
                required
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="button-container">
                <button className="cancel-btn" onClick={closeAddDomainsPopup}>Cancel</button>
                <button className="submit-btn" onClick={handleAddDomain}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BannedDomains;
