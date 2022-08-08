/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Box, extendTheme, NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

const newColorTheme = {
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
    _dark: 'light',
  },
};

const theme = extendTheme({ colors: newColorTheme });

const App = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Box>Hello world</Box>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
