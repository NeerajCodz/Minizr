import '../App.css';
import React from 'react';
import AdSenseAd from '../utils/Adsense';
import UrlShortenerForm from './UrlShortenerForm';
import '../css/Home.css'
function Home() {
  return (
    <div className="Home" style={{ overflowX: 'hidden' }}>
    <UrlShortenerForm />
    <AdSenseAd/>
    </div>
  );
}

export default Home;