import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { PhoneNumberContextProvider } from './context/phoneNumberContext';
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <PhoneNumberContextProvider>
        <App />
      </PhoneNumberContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
