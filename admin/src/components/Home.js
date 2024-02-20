import '../App.css';
import React from 'react';
import Header from './Header';
import FeatureBoxes from './FeaturesBox';
import AdSenseAd from '../utils/Adsense';
import Footer from './Footer';
import UrlShortenerForm from './UrlShortenerForm';

function Home() {
  return (
    <div className="Home">
        <Header/>
        <UrlShortenerForm />
        <AdSenseAd/>
        <FeatureBoxes/>
        <Footer/>
    </div>
  );
}

export default Home;