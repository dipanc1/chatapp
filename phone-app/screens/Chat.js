import { View, useWindowDimensions, StyleSheet } from 'react-native'
import React from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
import Conversations from '../components/Conversations'
import GroupChats from '../components/GroupChats'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native'
import Chatbox from '../components/Chatbox'

const Tab = createMaterialTopTabNavigator();


const Chat = () => {

    return (
        <View style={styles.chat}>
            <Navbar />
            <Search />
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Chats" component={Conversations} />
                    <Tab.Screen name="Groups" component={GroupChats} />
                </Tab.Navigator>
            </NavigationContainer>
            {/* <Chatbox/> */}
        </View>
    )
}

const styles = StyleSheet.create({
    chat: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    tabs: {
        // flex: 1,
        backgroundColor: '#b91919',
    }
})


export default Chat