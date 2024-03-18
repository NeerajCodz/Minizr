import React from 'react';
import UrlShortenerForm from '../components/UrlShortenerForm';
import FeatureBoxes from '../components/FeaturesBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
function Home() {
  return (
    <body>
        <section className='Header' >
            <Header/>
        </section>
        <section className='UrlSection'>
            <UrlShortenerForm />
        </section>
        <FeatureBoxes/>
        <section className='Footer' style={{overflowX:'hidden'}}>
            <Footer/>
        </section>
    </body>
  );
}

export default Home;