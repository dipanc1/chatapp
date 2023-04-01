import React from 'react'
import GroupCard from '../components/Groups/GroupCard';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const AllGroups = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarScrollEnabled: true,
            tabBarItemStyle: { width: 150 },
        }}>
            <Tab.Screen name="All Groups">
                {props => <GroupCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Joined Groups">
                {props => <GroupCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="My Groups">
                {props => <GroupCard {...props} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default AllGroups