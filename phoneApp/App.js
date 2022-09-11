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
import { PhoneAppContextProvider } from './context/PhoneAppContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import Chat from './screens/Chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const newColorTheme = {
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
  error: {
    100: '#FF4343',
    _dark: '#ff0000',
  },
  greyTextColor: {
    default: '#737373',
    _dark: '#737373',
  },
  white: {
    100: 'white',
    _dark: 'light',
  },
  primary: {
    50: '#E3F2F9',
    100: '#EAE4Ff',
    200: '#F5F7FB',
    300: '#9F85F7',
    400: '#4f436d',
    500: '#737373',
    600: '#2E354B',
    700: '#ff4343',
    800: '#3CC4B7',
    900: 'grey.900',
  },
  secondary: {
    100: '#9F85F7',
  }
};

const theme = extendTheme({ colors: newColorTheme });
const Stack = createNativeStackNavigator();


const App = () => {
  const [user, setUser] = React.useState(null);
  const [fetchAgain, setFetchAgain] = React.useState(false)

  React.useEffect(() => {
    const getUserDetails = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user')
        return jsonValue != null ? JSON.parse(jsonValue) : null
      } catch (e) {
        // read error
        console.log(e)
      }

      console.log('Done.')
    }
    getUserDetails().then(res => {
      setUser(res)
    });

  }, [fetchAgain]);

  return (
    <NativeBaseProvider theme={theme}>
      <PhoneAppContextProvider>
        {user ?
          <Chat user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          :
          <NavigationContainer>
            <Stack.Navigator intialRouteName="Login">
              <Stack.Screen name="Login">
                {props => <Login {...props} setUser={setUser} />}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {props => <Register {...props} />}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        }
      </PhoneAppContextProvider>
    </NativeBaseProvider>
  );
};

export default App;
