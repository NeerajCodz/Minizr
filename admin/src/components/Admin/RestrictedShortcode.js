import React, { useEffect, useState, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Admin.css';
import { FiHelpCircle } from "react-icons/fi";

function RestrictedShortcodes() {
  const [restrictedShortcodesTable, setRestrictedShortcodesTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddShortcodesOpen, setIsAddShortcodesOpen] = useState(false); // State to control the AddShortcodesPopup
  const [newShortcode, setNewShortcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const pageSize = 10;

  const fetchRestrictedShortcodes = useCallback(async () => {
    try {
      const restrictedShortcodesRef = collection(db, 'restricted-shortcodes');
      const q = query(restrictedShortcodesRef, orderBy('timestamp', 'desc'), limit(pageSize * currentPage));
      const querySnapshot = await getDocs(q);
      const restrictedShortcodesData = [];
      querySnapshot.forEach((doc) => {
        restrictedShortcodesData.push({ id: doc.id, ...doc.data() });
      });
      setRestrictedShortcodesTable(restrictedShortcodesData);
    } catch (error) {
      console.error('Error fetching restricted shortcodes:', error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchRestrictedShortcodes();
  }, [fetchRestrictedShortcodes]);

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
      await deleteDoc(doc(db, 'restricted-shortcodes', docId));
      console.log('Restricted shortcode document deleted successfully:', docId);
      setCurrentPage(1);
      // Reload the table by fetching the updated data
      await fetchRestrictedShortcodes(currentPage);
    } catch (error) {
      console.error('Error deleting restricted shortcode document:', error);
    }
  };

  const openAddShortcodesPopup = () => {
    setIsAddShortcodesOpen(true);
  };

  const closeAddShortcodesPopup = () => {
    setIsAddShortcodesOpen(false);
    setNewShortcode('');
    setErrorMessage('');
  };

  const handleAddShortcode = async () => {
    try {
      if (!newShortcode) {
        setErrorMessage('Please enter a shortcode.');
        return;
      }

      // Use newShortcode as the document name
      const newShortcodeName = newShortcode.trim(); // Trim any whitespace from the input
      const docRef = doc(db, 'restricted-shortcodes', newShortcodeName);

      // Add a timestamp field to the document
      await setDoc(docRef, { timestamp: serverTimestamp() });

      // Refresh the restricted shortcodes table by calling fetchRestrictedShortcodes
      await fetchRestrictedShortcodes();

      setNewShortcode('');
      closeAddShortcodesPopup(); // Close the popup
    } catch (error) {
      console.error('Error adding new shortcode:', error);
      setErrorMessage('Error adding new shortcode.');
    }
  };

  return (
    <section className='Admin-dashboard'>
      <div className='Admin-table'>
        <h1>RESTRICTED SHORTCODES</h1>
        {restrictedShortcodesTable.length === 0 ? (
          <div className='NothingFound'>
            <FiHelpCircle className='icon'/>
            <p style={{ textAlign: 'center' }}>No restricted shortcodes found...</p>
          </div>
        ) : (
          <table className='popup-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Shortcode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {restrictedShortcodesTable.map((shortcode) => (
              <tr key={shortcode.id}>
                <td>{shortcode.timestamp?.toDate().toLocaleDateString()}</td>
                <td>{shortcode.id}</td>
                <td>
                  <button className='more-btn' onClick={() => handleRemoveDocument(shortcode.id)}>Remove</button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
           )}
        {restrictedShortcodesTable.length > 0 && (
          <div className='button-container'>
            {currentPage > 1 ? (
              <button className='prev-btn' onClick={handleCollapsePage}>Collapse</button>
            ) : (
              <button className='prev-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>Collapse</button>
            )}
            {restrictedShortcodesTable.length === pageSize * currentPage ? (
              <button className='next-btn' onClick={handleMorePage}>More</button>
            ) : (
              <button className='next-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>More</button>
            )}
          </div>
        )} 
        <button className='danger-btn' style={{marginTop: '15px',backgroundColor: '#cc2222', boxShadow: '0 5px 6px rgba(0, 0, 0, 0.2)'}} onClick={openAddShortcodesPopup}>RESTRICT</button>
        
        {/* Render AddShortcodesPopup if isAddShortcodesOpen is true */}
        {isAddShortcodesOpen && (
          <div className="popup">
            <div className="popup-content">
              <button className="close" onClick={closeAddShortcodesPopup}>&times;</button>
              <h2>Restrict Shortcode</h2>
              <input
                type="text"
                value={newShortcode}
                onChange={(e) => setNewShortcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddShortcode();
                  }
                }}
                placeholder="Enter new shortcode to restrict"
                required
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="button-container">
                <button className="cancel-btn" onClick={closeAddShortcodesPopup}>Cancel</button>
                <button className="submit-btn" onClick={handleAddShortcode}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RestrictedShortcodes;
