import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { PhoneNumberContextProvider } from './context/phoneNumberContext';

const customTheme = extendTheme({
  semanticTokens: {
    colors: {
      error: 'red.500',
      text: {
        default: 'gray.900',
        _dark: 'gray.50',
      },
      backgroundColor: {
        default: '#EAE4Ff',
        _dark: '#1d2127',
      },
      selectPrimaryColor: {
        default: '#EAE4Ff',
        _dark: '#0070f3',
      },
      selectSecondaryColor: {
        default: '#F5F7FB',
        _dark: '#0070f3',
      },
      buttonPrimaryColor: {
        default: '#9F85F7',
        _dark: '#9e84f7',
      },
      ownChatColor: {
        default: '#4f436d',
        _dark: '#4f436d',
      },
      errorColor: {
        default: '#FF4343',
        _dark: '#ff0000',
      },
      greyTextColor:{
        default: '#737373',
        _dark: '#737373',
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={customTheme}>
        <PhoneNumberContextProvider>
          <App />
        </PhoneNumberContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
