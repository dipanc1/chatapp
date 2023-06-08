import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SettingCard from '../components/Settings/SettingCard';
import TabNavigatorStyled from '../components/Miscellaneous/TabNavigatorStyled';
import { PhoneAppContext } from '../context/PhoneAppContext';

const Tab = createMaterialTopTabNavigator();

const Settings = ({ user }) => {
    const { userInfo } = useContext(PhoneAppContext);

    return (
        <TabNavigatorStyled>
            <Tab.Screen name="My Details">
                {props => <SettingCard {...props} name={"My Details"} user={userInfo} />}
            </Tab.Screen>
            <Tab.Screen name="Themes">
                {props => <SettingCard {...props} name={"Themes"} />}
            </Tab.Screen>
            <Tab.Screen name="Password">
                {props => <SettingCard {...props} name={"Password"} />}
            </Tab.Screen>
            <Tab.Screen name="Notification">
                {props => <SettingCard {...props} name={"Notification"} />}
            </Tab.Screen>
            <Tab.Screen name="Plans">
                {props => <SettingCard {...props} name={'Plans'} />}
            </Tab.Screen>
            <Tab.Screen name="Billing">
                {props => <SettingCard {...props} name={'Billing'} />}
            </Tab.Screen>
            <Tab.Screen name="Help">
                {props => <SettingCard {...props} />}
            </Tab.Screen>
        </TabNavigatorStyled>
    )
}

export default Settings