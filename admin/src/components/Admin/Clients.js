import React, { useEffect, useState, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Admin.css';
import { FiHelpCircle } from "react-icons/fi";

function Clients() {
  const [clientsTable, setClientsTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddClientsOpen, setIsAddClientsOpen] = useState(false); // State to control the AddClientsPopup
  const [newClient, setNewClient] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const pageSize = 10;

  const fetchClients = useCallback(async () => {
    try {
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef, orderBy('timestamp', 'desc'), limit(pageSize * currentPage));
      const querySnapshot = await getDocs(q);
      const clientsData = [];
      querySnapshot.forEach((doc) => {
        const clientData = doc.data();
        clientsData.push({ id: doc.id, ...clientData, active: clientData.Active });
      });
      setClientsTable(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }, [currentPage, pageSize]);


  const toggleActiveStatus = async (clientId, currentActiveStatus) => {
    try {
      const docRef = doc(db, 'clients', clientId);
      await updateDoc(docRef, { Active: !currentActiveStatus }); // Toggle Active status
      await fetchClients(); // Refresh clients table
    } catch (error) {
      console.error('Error toggling Active status:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

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
      await deleteDoc(doc(db, 'clients', docId));
      console.log('client document deleted successfully:', docId);
      setCurrentPage(1);
      // Reload the table by fetching the updated data
      fetchClients(currentPage);
    } catch (error) {
      console.error('Error deleting client document:', error);
    }
  };

  const openAddClientsPopup = () => {
    setIsAddClientsOpen(true);
  };

  const closeAddClientsPopup = () => {
    setIsAddClientsOpen(false);
    setNewClient('');
    setErrorMessage('');
  };

  const handleAddClient = async () => {
    try {
      if (!newClient) {
        setErrorMessage('Please enter a client url.');
        return;
      }

      // Use newClient as the document name
      const newClientName = newClient.trim(); // Trim any whitespace from the input
      const docRef = doc(db, 'clients', newClientName);

      // Add a timestamp field to the document
      await setDoc(docRef, { timestamp: serverTimestamp(), Active: true });

      // Refresh the clients table by calling fetchClients
      await fetchClients();

      setNewClient('');
      closeAddClientsPopup(); // Close the popup
    } catch (error) {
      console.error('Error adding new client:', error);
      setErrorMessage('Error adding new client.');
    }
  };

  return (
    <section className='Admin-dashboard'>
      <div className='Admin-table'>
        <h1>MY CLIENTS</h1>
        {clientsTable.length === 0 ? (
          <div className='NothingFound'>
            <FiHelpCircle className='icon'/>
            <p style={{ textAlign: 'center' }}>No clients found...</p>
          </div>
        ) : (
          <table className='popup-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Active</th>
                <th>Clients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                  {clientsTable.map((client) => (
                      <tr key={client.id}>
                      <td>{client.timestamp.toDate().toLocaleDateString()}</td>
                      <td>{client.Active ? "True" : "False"}</td>
                      <td>{client.id}</td>
                      <td>
                          <button className='more-btn' onClick={() => handleRemoveDocument(client.id)} style={{marginRight:'2px'}}>Remove</button>
                          <button className='more-btn' onClick={() => toggleActiveStatus(client.id, client.Active)} style={{marginLeft:'2px'}}>
                          {client.Active ? "Deactivate" : "Activate"}
                          </button>
                      </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        )}

        
        {clientsTable.length > 0 && (
          <div className='button-container'>
            {currentPage > 1 ? (
              <button className='prev-btn' onClick={handleCollapsePage}>Collapse</button>
            ) : (
              <button className='prev-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>Collapse</button>
            )}

            {clientsTable.length === pageSize * currentPage ? (
              <button className='next-btn' onClick={handleMorePage}>More</button>
            ) : (
              <button className='next-btn' style={{ backgroundColor: '#cccccc', pointerEvents: 'none' }}>More</button>
            )}
          </div>
        )}
                
        <button className='danger-btn' style={{marginTop: '15px',backgroundColor: '#cc2222', boxShadow: '0 5px 6px rgba(0, 0, 0, 0.2)'}} onClick={openAddClientsPopup}>ADD CLIENTS</button>

        {/* Render AddClientsPopup if isAddClientsOpen is true */}
        {isAddClientsOpen && (
          <div className="popup">
            <div className="popup-content">
              <button className="close" onClick={closeAddClientsPopup}>&times;</button>
              <h2>Add Clients</h2>
              <input
                type="text"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddClient();
                  }
                }}
                placeholder="Enter new client"
                required
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="button-container">
                <button className="cancel-btn" onClick={closeAddClientsPopup}>Cancel</button>
                <button className="submit-btn" onClick={handleAddClient}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Clients;
