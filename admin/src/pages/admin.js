import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/Admin/Login';
import AdminPortal from '../components/Admin/Portal';
import '../styles/Home.css';
import '../styles/Header.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Admin() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdminSession = () => {
      const storedSession = JSON.parse(localStorage.getItem('adminSession'));
      if (storedSession && Date.now() < storedSession.expiry) {
        setIsAdminAuthenticated(true);
      }
    };

    checkAdminSession();
  }, []);

  return (
    <main>
      <section className='Header'>
        <Header />
      </section>
      {isAdminAuthenticated ? <AdminPortal /> : <AdminLogin />}
      <section className='Footer' style={{ overflowX: 'hidden' }}>
        <Footer />
      </section>
    </main>
  );
}

export default Admin;
