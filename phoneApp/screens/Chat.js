import React from 'react'
import Navbar from '../components/UserChat/Navbar'
import Conversations from '../components/UserChat/Conversations'
import Groups from '../components/UserChat/Groups'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native'
import Searchbar from '../components/Miscellaneous/Searchbar';

const Tab = createMaterialTopTabNavigator();

const Chat = () => {
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
        <>
            <Navbar />
            <Searchbar />
            <NavigationContainer>
                <Tab.Navigator {...{ screenOptions, sceneContainerStyle }}>
                    <Tab.Screen name="Conversations">
                        {props => <Conversations {...props} />}
                    </Tab.Screen>
                    <Tab.Screen name="Groups">
                        {props => <Groups {...props} />}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </>
    )
}

export default Chat