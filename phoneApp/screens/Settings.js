import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SettingCard from '../components/Settings/SettingCard';

const Tab = createMaterialTopTabNavigator();

const Settings = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarScrollEnabled: true,
            tabBarItemStyle: { width: 150 },
        }}>
            <Tab.Screen name="My Details">
                {props => <SettingCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Themes">
                {props => <SettingCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Password">
                {props => <SettingCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Notification">
                {props => <SettingCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Plans">
                {props => <SettingCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Billing">
                {props => <SettingCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Help">
                {props => <SettingCard {...props} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default Settings