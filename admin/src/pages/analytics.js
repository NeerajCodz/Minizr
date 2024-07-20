import React from 'react';
import '../styles/Home.css'
import '../styles/Header.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Form from '../components/Analytics/Form';
function Analytics() {
  return (
    <main>
        <section className='Header'>
            <Header/>
        </section>
        <Form/>
        <section className='Footer' style={{ overflowX: 'hidden' }}>
            <Footer/>
        </section>
    </main>
  );
}

export default Analytics;