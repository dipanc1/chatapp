/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Box, extendTheme, Icon, NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { PhoneAppContextProvider } from './context/PhoneAppContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AllGroups from './screens/AllGroups';
import Settings from './screens/Settings';
import Events from './screens/Events';
import { Image } from 'react-native';
import VideoChat from './screens/VideoChat';
import { StripeProvider } from '@stripe/stripe-react-native';
import { stripePublicKeyLive, stripePublicKey } from './production';

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
    600: '#42495d',
    700: '#ff4343',
    800: '#3CC4B7',
    900: 'grey.900',
  },
  secondary: {
    100: '#9F85F7',
  },
  plans: {
    100: '#9F85F7',
    200: '#3CC4B7',
    300: '#FFD700',
  },
};

const theme = extendTheme({ colors: newColorTheme });
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [user, setUser] = React.useState(null);
  const [fetchAgain, setFetchAgain] = React.useState(false);
  const CDN_IMAGES = "https://ik.imagekit.io/sahildhingra";

  const TabBarIcon = ({ size, color, icon }) => {
    return (
      <Icon color={color} size={size}
        as={<Image
          style={{ width: 20, height: 20, tintColor: color }}
          source={{
            uri: `${CDN_IMAGES}/${icon}.png`,
          }}
        />} />
    );
  };

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
    <StripeProvider publishableKey={stripePublicKey}>
      <NativeBaseProvider theme={theme}>
        <PhoneAppContextProvider>
          <NavigationContainer>
            {user ?
              <Tab.Navigator initialRouteName='Live Stream' screenOptions={
                {
                  tabBarStyle: {
                    borderTopWidth: 0,
                    shadowOffset: { width: 0, height: 0 },
                    shadowColor: 'transparent',
                    elevation: 0,
                  },
                  tabBarActiveTintColor: '#9F85F7',
                  tabBarInactiveTintColor: '#737373',
                  headerShown: false,
                  tabBarHideOnKeyboard: true,
                }
              }>
                <Tab.Screen name="Live Stream" options={{
                  headerShown: false,
                  tabBarIcon: ({ size, color }) => TabBarIcon({ icon: 'explore', size, color })
                }}>
                  {props => <VideoChat {...props} user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                </Tab.Screen>
                <Tab.Screen name="Events" options={{
                  tabBarIcon: ({ size, focused, color }) => TabBarIcon({ icon: 'events', size, color })
                }}>
                  {props => <Events {...props} user={user} />}
                </Tab.Screen>
                <Tab.Screen name="Groups" navigationKey="AllGroups" options={{
                  tabBarIcon: ({ size, focused, color }) => TabBarIcon({ icon: 'groups', size, color })
                }}>
                  {props => <AllGroups {...props} user={user} />}
                </Tab.Screen>
                <Tab.Screen name="Settings" options={{
                  tabBarIcon: ({ size, focused, color }) => TabBarIcon({ icon: 'settings', size, color })
                }}>
                  {props => <Settings {...props} user={user} />}
                </Tab.Screen>
              </Tab.Navigator>
              :
              <Stack.Navigator intialRouteName="Login">
                <Stack.Screen name="Login" options={{
                  headerShown: false,
                }}>
                  {props => <Login {...props} setUser={setUser} />}
                </Stack.Screen>
                <Stack.Screen name="Register" options={{
                  headerShown: false,
                }}>
                  {props => <Register {...props} />}
                </Stack.Screen>
              </Stack.Navigator>
            }
          </NavigationContainer>
        </PhoneAppContextProvider>
      </NativeBaseProvider>
    </StripeProvider>
  );
};

export default App;
