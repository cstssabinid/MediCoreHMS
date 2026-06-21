import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';

const savedTheme = localStorage.getItem('berwa_hms_theme');
const initialTheme = savedTheme === 'dark' || savedTheme === 'light'
  ? savedTheme
  : 'light';
document.documentElement.dataset.theme = initialTheme;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
