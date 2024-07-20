import React, { useEffect, useState, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Admin.css';
import { FiHelpCircle } from "react-icons/fi";

function ForbiddenShortcodes() {
  const [forbiddenShortcodesTable, setForbiddenShortcodesTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddShortcodesOpen, setIsAddShortcodesOpen] = useState(false); // State to control the AddShortcodesPopup
  const [newShortcode, setNewShortcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const pageSize = 10;

  const fetchForbiddenShortcodes = useCallback(async () => {
    try {
      const forbiddenShortcodesRef = collection(db, 'forbidden-shortcodes');
      const q = query(forbiddenShortcodesRef, orderBy('timestamp', 'desc'), limit(pageSize * currentPage));
      const querySnapshot = await getDocs(q);
      const forbiddenShortcodesData = [];
      querySnapshot.forEach((doc) => {
        forbiddenShortcodesData.push({ id: doc.id, ...doc.data() });
      });
      setForbiddenShortcodesTable(forbiddenShortcodesData);
    } catch (error) {
      console.error('Error fetching forbidden shortcodes:', error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchForbiddenShortcodes();
  }, [fetchForbiddenShortcodes]);

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
      await deleteDoc(doc(db, 'forbidden-shortcodes', docId));
      console.log('Forbidden shortcode document deleted successfully:', docId);
      setCurrentPage(1);
      // Reload the table by fetching the updated data
      await fetchForbiddenShortcodes(currentPage);
    } catch (error) {
      console.error('Error deleting forbidden shortcode document:', error);
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
      const docRef = doc(db, 'forbidden-shortcodes', newShortcodeName);

      // Add a timestamp field to the document
      await setDoc(docRef, { timestamp: serverTimestamp() });

      // Refresh the forbidden shortcodes table by calling fetchForbiddenShortcodes
      await fetchForbiddenShortcodes();

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
        <h1>FORBIDDEN SHORTCODES</h1>
        {forbiddenShortcodesTable.length === 0 ? (
          <div className='NothingFound'>
            <FiHelpCircle className='icon'/>
            <p style={{ textAlign: 'center' }}>No forbidden shortcodes found...</p>
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
            {forbiddenShortcodesTable.map((shortcode) => (
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
        {forbiddenShortcodesTable.length > 0 && (
          <div className='button-container'>
            {currentPage > 1 ? (
              <button className='prev-btn' onClick={handleCollapsePage}>Collapse</button>
            ) : (
              <button className='prev-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>Collapse</button>
            )}
            {forbiddenShortcodesTable.length === pageSize * currentPage ? (
              <button className='next-btn' onClick={handleMorePage}>More</button>
            ) : (
              <button className='next-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>More</button>
            )}
          </div>
        )} 
        <button className='danger-btn' style={{marginTop: '15px',backgroundColor: '#cc2222', boxShadow: '0 5px 6px rgba(0, 0, 0, 0.2)'}} onClick={openAddShortcodesPopup}>FORBID</button>
        
        {/* Render AddShortcodesPopup if isAddShortcodesOpen is true */}
        {isAddShortcodesOpen && (
          <div className="popup">
            <div className="popup-content">
              <button className="close" onClick={closeAddShortcodesPopup}>&times;</button>
              <h2>Forbid Shortcode</h2>
              <input
                type="text"
                value={newShortcode}
                onChange={(e) => setNewShortcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddShortcode();
                  }
                }}
                placeholder="Enter new shortcode for forbid"
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

export default ForbiddenShortcodes;
