import React from 'react';
import { useLocation } from 'react-router-dom';
import Home from './Home';
import AnalyticsForm from './Analytics/AnalyticsForm';
import AdminLogin from './Admin/AdminLogin';
import Open from './Open';

function CustomRoute() {
  const location = useLocation();
  const { pathname } = location;

  let ComponentToRender;
  switch (pathname) {
    case '/':
    case '/home':
      ComponentToRender = <Home />;
      break;
    case '/analytics':
      ComponentToRender = <AnalyticsForm />;
      break;
    case '/admin':
      ComponentToRender = <AdminLogin />;
      break;
    default:
      ComponentToRender = <Open shortcode={pathname} />;
      break;
  }

  return ComponentToRender;
}

export default CustomRoute;
