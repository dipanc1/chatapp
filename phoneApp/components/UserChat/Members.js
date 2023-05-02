import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Participants from '../Miscellaneous/Participants';
import Settings from '../Miscellaneous/Settings';
import Chatbox from './Chatbox';
import EventsCard from '../Events/EventsCard';
import { PhoneAppContext } from '../../context/PhoneAppContext';

const Tab = createMaterialTopTabNavigator();

//TODO: Change color of the tab bar

let eventsTab = false;

const Members = ({ user, fetchAgain, setFetchAgain }) => {
  const screenOptions = {
    headerShown: false,
    tabBarLabelStyle: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    tabBarActiveTintColor: '#9F85F7',
    tabBarInactiveTintColor: 'grey',
    tabBarScrollEnabled: true,
    tabBarItemStyle: {
      padding: 0,
      margin: 0,
      width: 150,
    },
    tabBarIndicatorStyle: {
      backgroundColor: '#9F85F7',
    },
  };

  const sceneContainerStyle = {
    backgroundColor: '#F5F7FB',
  };

  const { selectedChat } = React.useContext(PhoneAppContext)

  return (
    <Tab.Navigator {...{ screenOptions, sceneContainerStyle }}>
      <Tab.Screen
        name="Chat"
      >
        {props => <Chatbox {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="Members"
      >
        {props => <Participants {...props} user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Tab.Screen>
      <Tab.Screen
        name="Events"
      >
        {props => <EventsCard {...props} user={user} data={selectedChat?.events} screen={eventsTab} />}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
      >
        {props => <Settings {...props} user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default Members