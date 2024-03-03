import React, { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Header from '../Header';
import Footer from '../Footer';
import AdminPortal from './AdminPortal.js'; // Assuming you have an AdminPortal component
import '../../css/Home.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons

function AdminLogin() {
  const [Username, setAdminUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the admin document from Firestore
      const docRef = doc(db, 'admin', 'login');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const { username: storedUsername, password: storedPassword } = data;

        // Check if entered Username and password match with stored credentials
        if (Username === storedUsername && Password === storedPassword) {
          setRedirectToAdmin(true);
        } else {
          setErrorMessage('Invalid Username or password.');
        }
      } else {
        setErrorMessage('Admin credentials not found.');
      }
    } catch (error) {
      console.error('Error fetching admin credentials:', error);
      setErrorMessage('Error fetching admin credentials.');
    }
  };

  // Render the AdminPortal component if redirectToAdmin is true
  if (redirectToAdmin) {
    return <AdminPortal Username={Username} Password={Password} />;
  }

  return (
    <main>
      <Header />
      <section className='UrlSection'>
        <div className="container">
          <h1 className="title">Admin Login</h1>
          <p className="text">Enter admin login credentials</p>
          <div className='formbox'>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={Username}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <div className='password-input'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                {showPassword ? (
                  <FaEyeSlash className='eye-icon' onClick={() => setShowPassword(false)} />
                ) : (
                  <FaEye className='eye-icon' onClick={() => setShowPassword(true)} />
                )}
              </div>
              {errorMessage && <p className="result-message">{errorMessage}</p>}
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default AdminLogin;
