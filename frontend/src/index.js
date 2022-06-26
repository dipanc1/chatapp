import { ChakraProvider } from '@chakra-ui/react';
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { PhoneNumberContextProvider } from './context/phoneNumberContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <PhoneNumberContextProvider>
          <App />
        </PhoneNumberContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
