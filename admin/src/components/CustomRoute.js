import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import Home from './Home';
import AnalyticsForm from './AnalyticsForm'; // Import the Analytics component

function CustomRoute() {
  const location = useLocation();

  // Check if the current URL matches '/analytics'
  const isAnalyticsRoute = location.pathname === '/analytics';

  return (
    <>
      {isAnalyticsRoute ? <AnalyticsForm /> : <Home />}
    </>
  );
}

export default CustomRoute;
