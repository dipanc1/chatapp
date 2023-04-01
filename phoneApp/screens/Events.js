import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EventsCard from '../components/Events/EventsCard';

const Tab = createMaterialTopTabNavigator();

const Events = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarScrollEnabled: true,
            tabBarItemStyle: { width: 150 },
        }}>
            <Tab.Screen name="Group Events">
                {props => <EventsCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Upcoming Events">
                {props => <EventsCard {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Previous Events">
                {props => <EventsCard {...props} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default Events