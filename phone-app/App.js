import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PhoneAppContextProvider } from './context/PhoneAppContext';
import Login from './screens/Login';
import Register from './screens/Register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
    <PhoneAppContextProvider>
      <View style={styles.container}>
        {/* <Stack.Navigator initialRouteName="Login"> */}
        {/* <Stack.Screen name="Login" component={Login} /> */}
        {/* <Login /> */}
        <Register />
        {/* <Stack.Screen name="Register" component={Register} /> */}
        {/* </Stack.Navigator> */}
      </View>
    </PhoneAppContextProvider>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
