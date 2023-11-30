/**
 * @file index.tsx
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpreadSheetDisplay from './client/spreadSheetDisplay';
import reportWebVitals from './reportWebVitals';

/**
 * This is the root - the entry point to our react web app
 */
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
document.title = "Spreadsheet";
root.render(
  <React.StrictMode>
    {/* the spreadsheet component */}
    <SpreadSheetDisplay />
  </React.StrictMode>
);

// provided via create react app
reportWebVitals();
