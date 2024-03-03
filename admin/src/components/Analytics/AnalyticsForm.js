import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import AnalyticsDisplay from './AnalyticsDisplay';
import Header from '../Header';
import Footer from '../Footer';

function AnalyticsForm() {
  const [shortcode, setShortcode] = useState('');
  const [AnalyticsID, setAnalyticsID] = useState('');
  const [redirectToAnalytics, setRedirectToAnalytics] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shortcodeParam = searchParams.get('shortcode');
    const analyticsidParam = searchParams.get('AnalyticsID');

    if (shortcodeParam && analyticsidParam) {
      handleValidation(shortcodeParam, analyticsidParam);
    }
  }, [location.search]);

  const handleValidation = async (shortcodeParam, analyticsidParam) => {
    const docRef = doc(db, 'urls', shortcodeParam);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const analyticsIDFromDatabase = docSnapshot.data().AnalyticsID;

      if (analyticsIDFromDatabase === analyticsidParam) {
        setShortcode(shortcodeParam);
        setAnalyticsID(analyticsidParam);
        setRedirectToAnalytics(true);
      } else {
        setErrorMessage('AnalyticsID does not match');
      }
    } else {
      setErrorMessage('Shortcode does not exist in the database');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleValidation(shortcode, AnalyticsID);
  };

  if (redirectToAnalytics) {
    return <AnalyticsDisplay shortcode={shortcode} AnalyticsID={AnalyticsID} />;
  }

  return (
      <main>
        <Header />
        <section className='UrlSection'>
          <div className="container">
            <h1 className="title">Analytics</h1>
            <p className="text">Check/Track your URL's.</p>
            <div className='formbox'>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={shortcode}
                  onChange={(e) => setShortcode(e.target.value)}
                  placeholder="ShortURL/Shortcode"
                  required
                />
                <input
                  type="text"
                  value={AnalyticsID}
                  onChange={(e) => setAnalyticsID(e.target.value)}
                  placeholder="Analytics ID"
                />
                {errorMessage && <p className="result-message">{errorMessage}</p>}
                <button type="submit">Show Analytics</button>
              </form>
            </div>
          </div>
        </section>
        <Footer/>
      </main>
  );
}

export default AnalyticsForm;
