import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'

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
    tabBarIndicatorStyle: {
        backgroundColor: '#9F85F7',
    },
    tabBarScrollEnabled: true,
    tabBarItemStyle: { width: 170 },
};
const sceneContainerStyle = {
    backgroundColor: '#F5F7FB',
};

const Tab = createMaterialTopTabNavigator();
const TabNavigatorStyled = ({ children }) => {

    return (
        <Tab.Navigator {...{ screenOptions, sceneContainerStyle }}>
            {children}
        </Tab.Navigator>
    )
}

export default TabNavigatorStyled