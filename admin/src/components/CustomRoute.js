import React from 'react';
import { useLocation } from 'react-router-dom';
import Home from '../pages/home';
import Admin from '../pages/admin';
import Open from '../pages/open';
import Analytics from '../pages/analytics';

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
      ComponentToRender = <Analytics/>;
      break;
    case '/admin':
      ComponentToRender = <Admin />;
      break;
    default:
      ComponentToRender = <Open shortcode={pathname} />;
      break;
  }

  return ComponentToRender;
}

export default CustomRoute;
