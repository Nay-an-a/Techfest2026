import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ParticipantsProvider } from './context/ParticipantsContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './styles/theme.css';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <ParticipantsProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
          </BrowserRouter>
        </ParticipantsProvider>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
);
