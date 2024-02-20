import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomRoute from './components/CustomRoute'; // Assuming you have a custom Route component
import YouAreBanned from './components/YouAreBanned';
import BannedHosts from './components/BannedHosts'; // Import the BannedHosts component

function App() {
  // Check if the user is banned
  const {exists} = BannedHosts();

  return (
    <Router>
      <Routes>
        {/* Render the YouAreBanned component if the user is banned */}
        {!exists && (
          <Route path="/*" element={<CustomRoute />} />
        )}
        {exists && <Route path="*" element={<YouAreBanned />} />}

        {/* Render the custom Route component for all other routes if the user is not banned */}
      </Routes>
    </Router>
  );
}

export default App;
