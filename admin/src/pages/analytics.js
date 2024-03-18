import React from 'react';
import '../styles/Home.css'
import '../styles/Header.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnalyticsForm from '../components/Analytics/AnalyticsForm';
function Home() {
  return (
    <body>
        <section className='Header'>
            <Header/>
        </section>
        <section className='Analytics'>
            <AnalyticsForm/>
        </section>
        <section className='Footer' style={{ overflowX: 'hidden' }}>
            <Footer/>
        </section>
    </body>
  );
}

export default Home;