import { ChakraProvider } from '@chakra-ui/react';
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { PhoneNumberContextProvider } from './context/phoneNumberContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <PhoneNumberContextProvider>
        <App />
      </PhoneNumberContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
