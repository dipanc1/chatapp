import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatDel from '../Miscellaneous/ChatDel';
import Participants from '../Miscellaneous/Participants';
import Settings from '../Miscellaneous/Settings';

const Tab = createMaterialTopTabNavigator();

const Members = () => {
  const screenOptions = {
    unmountOnBlur: false,
    headerShown: false,
    tabBarLabelStyle: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    tabBarActiveTintColor: '#9F85F7',
    tabBarInactiveTintColor: 'grey',
    tabBarItemStyle: {
      padding: 0,
      margin: 0,
    },
  };
  const sceneContainerStyle = {
    backgroundColor: '#F5F7FB',
  };

  return (
    <Tab.Navigator {...{ screenOptions, sceneContainerStyle }}>
      <Tab.Screen
        name="Chat"
        component={ChatDel}
      />
      <Tab.Screen
        name="Participants"
        component={Participants}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
      />
    </Tab.Navigator>
  )
}

export default Members