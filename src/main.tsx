// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import './index.css';
import App from './App';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf/dist/Page/TextLayer.css';


// Find the root element in your HTML file
const rootElement = document.getElementById('root');

// Create a root using createRoot
const root = ReactDOM.createRoot(rootElement as HTMLElement);

// Render your app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
