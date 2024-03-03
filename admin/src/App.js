import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomRoute from './components/CustomRoute'; // Importing  a custom Route component
import YouAreBanned from './components/YouAreBanned';
import BannedHosts from './components/Hosts'; // Import the BannedHosts component
import Footer from './components/Footer';
import Header from './components/Header';

function App() {
  // Check if the user is banned
  const { exists } = BannedHosts();


  return (
    <Router>
      <section style={{ padding: '25px' }}>
        <Header />
      </section>
        <Routes>
          {/* Render the YouAreBanned component if the user is banned */}
          {!exists && (
            <Route path="/*" element={<CustomRoute />} />
          )}
          {exists && <Route path="*" element={<YouAreBanned />} />}
        </Routes>
        <section><Footer /></section>
    </Router>
  );
}

export default App;
