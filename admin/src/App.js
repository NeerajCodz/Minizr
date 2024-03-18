import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomRoute from './components/CustomRoute'; // Importing  a custom Route component
import YouAreBanned from './pages/YouAreBanned';
import BannedHosts from './utils/getHosts'; // Import the BannedHosts component

function App() {
  // Check if the user is banned
  const { exists } = BannedHosts();


  return (
    <Router>
        <Routes>
          {/* Render the YouAreBanned component if the user is banned */}
          {!exists && (
            <Route path="/*" element={<CustomRoute />} />
          )}
          {exists && <Route path="*" element={<YouAreBanned />} />}
        </Routes>
    </Router>
  );
}

export default App;
