import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { PhoneNumberContextProvider } from './context/phoneNumberContext';

ReactDOM.render(
  <React.StrictMode>
      <PhoneNumberContextProvider>
        <App />
      </PhoneNumberContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
