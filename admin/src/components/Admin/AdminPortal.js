import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, orderBy, limit, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Admin.css';
import Popup from './UrlPopup';
import trimUrl from '../../utils/trimUrl'; // Import trimUrl function

// Component for displaying URLs table and pagination
const UrlsTable = ({ urlsTable, openPopup }) => {
  return (
    <table className='popup-table' >
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
            <td>{new Date(url.timestamp.toDate()).toLocaleDateString()}</td>
            <td>{url.id}</td>
            <td><a href={url.LongURL} target="_blank" rel="noopener noreferrer">{trimUrl(url.LongURL)}</a></td>
            <td><button className='more-btn' onClick={() => openPopup(url)}>More</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function AdminPortal({ Username, Password }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [urlsTable, setUrlsTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupDetails, setPopupDetails] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    const checkAdminCredentials = async () => {
      try {
        const docRef = doc(db, 'admin', 'login');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const { username: storedUsername, password: storedPassword } = data;

          // Check if entered Username and password match with stored credentials
          if (Username === storedUsername && Password === storedPassword) {
            setIsAdmin(true);
            console.log('Admin credentials verified successfully.');

            // Fetch URLs data for the initial page
            fetchUrls(currentPage);
          }
        }

        setIsLoading(false); // Set loading state to false after checking credentials
      } catch (error) {
        console.error('Error checking admin credentials:', error);
        setIsLoading(false); // Set loading state to false in case of error
      }
    };

    checkAdminCredentials();
  }, [Username, Password, currentPage]);

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
      fetchUrls(currentPage - 1);
    }
  };

  const handleMorePage = () => {
    setCurrentPage(currentPage + 1);
    fetchUrls(currentPage + 1);
  };

  const openPopup = (details) => {
    setPopupDetails(details);
  };

  const closePopup = () => {
    setPopupDetails(null);
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

  // Display loading message while checking credentials
  if (isLoading) {
    console.log('Checking admin credentials...');
    return <p>Loading...</p>;
  }

  // Display appropriate message based on isAdmin state
  return (
      <main>
        {isAdmin ? (
          <section className='Url-dashboard' >
            
            <div className='Url-table'>
              <h1>URL DASHBOARD</h1>
              <UrlsTable urlsTable={urlsTable} openPopup={openPopup} />
              <div className='button-container'>
                <button className='prev-btn' onClick={handleCollapsePage} disabled={currentPage === 1}>Collapse</button>
                <button className='next-btn' onClick={handleMorePage}>More</button>
              </div>
              <Popup isOpen={!!popupDetails} onClose={closePopup} details={popupDetails} onDelete={handleDeleteDocument} onBan={handleBanDocument} />
            </div>
          </section>
        ) : (
          <p>Access denied.</p>
        )}
      </main>
  );
}

export default AdminPortal;
