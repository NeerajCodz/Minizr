import React from 'react';
import AdminLogin from '../components/Admin/AdminLogin';
import '../styles/Home.css'
import '../styles/Header.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
function Admin() {
  return (
    <body>
        <section className='Header'>
            <Header/>
        </section>
        <section className='Admin'>
            <AdminLogin />
        </section>
        <section className='Footer' style={{ overflowX: 'hidden' }}>
            <Footer/>
        </section>
    </body>
  );
}

export default Admin;