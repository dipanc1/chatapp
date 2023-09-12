import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from './context/AppContext';
import { SocketContextProvider } from './context/SocketContext';
import { RoomProvider } from './context/RoomContext';
import ReactGA from 'react-ga4';
import { trackingId } from './utils';


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
      greyTextColor: {
        default: '#737373',
        _dark: '#737373',
      },
      whiteColor: {
        default: 'white',
        _dark: 'light'
      }
    },
  },
})

ReactGA.initialize(trackingId)

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChakraProvider theme={customTheme}>
      <AppContextProvider>
        <SocketContextProvider>
          <RoomProvider>
            <App />
          </RoomProvider>
        </SocketContextProvider>
      </AppContextProvider>
    </ChakraProvider>
  </BrowserRouter>,
);
