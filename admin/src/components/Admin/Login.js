import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.js';
import AdminPortal from './Portal.js';
import '../../styles/Home.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { SHA256 } from 'crypto-js'; // Import SHA256 from crypto-js

function AdminLogin() {
  const [Username, setAdminUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchAdminCredentials = async () => {
      try {
        const docRef = doc(db, 'admin', 'login');
        const docSnap = await getDoc(docRef);

        // If admin login document does not exist, create it with default credentials
        if (!docSnap.exists()) {
          // Hash default username and password using SHA256
          const defaultUsername = SHA256('Admin').toString();
          const defaultPassword = SHA256('Admin').toString();
          await setDoc(docRef, { username: defaultUsername, password: defaultPassword });
        }
      } catch (error) {
        console.error('Error fetching admin credentials:', error);
        setErrorMessage('Error fetching admin credentials.');
      }
    };

    fetchAdminCredentials();
  }, []);

  useEffect(() => {
    const checkSessionExpiry = () => {
      const storedSession = JSON.parse(localStorage.getItem('adminSession'));
      if (storedSession && Date.now() < storedSession.expiry) {
        setRedirectToAdmin(true);
      }
    };

    checkSessionExpiry();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, 'admin', 'login');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const { username: storedUsername, password: storedPassword } = data;

        // Hash the entered username and password using SHA256
        const hashedUsername = SHA256(Username).toString();
        const hashedPassword = SHA256(Password).toString();

        if (hashedUsername === storedUsername && hashedPassword === storedPassword) {
          const expiry = Date.now() + 2 * 60 * 60 * 1000; // 2 hours expiry time
          localStorage.setItem('adminSession', JSON.stringify({ expiry }));
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

  if (redirectToAdmin) {
    return <AdminPortal Username={Username} Password={Password} />;
  }

  return (
    <main>
      <section className='MainSection'>
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
                <span className='eye-icon-container' onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash className='eye-icon' /> : <FaEye className='eye-icon' />}
                </span>
              </div>
              {errorMessage && <p className="result-message">{errorMessage}</p>}
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;
