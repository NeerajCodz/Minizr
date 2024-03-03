import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import favicon from './images/favicon.ico';

const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

const root = createRoot(rootElement);

root.render(
    <App />
);

// Dynamically set favicon
document.querySelector("link[rel*='icon']").href = favicon;
