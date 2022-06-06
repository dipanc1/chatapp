import { View, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
import Conversations from '../components/Conversations'
import GroupChats from '../components/GroupChats'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native'
import Chatbox from '../components/Chatbox'
import { backend_url } from '../production'
import axios from 'axios'
import { PhoneAppContext } from '../context/PhoneAppContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Tab = createMaterialTopTabNavigator();


const Chat = ({ user }) => {
    const { chats, dispatch } = useContext(PhoneAppContext)
    const [search, setSearch] = React.useState('')
    const [searchResultsUsers, setSearchResultsUsers] = React.useState([])
    const [searchResultsGroups, setSearchResultsGroups] = React.useState([])
    const [conversations, setConversations] = React.useState([])
    const [groupConversations, setGroupConversations] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    // search bar to search for users
    const handleSearch = async (e) => {
        setSearch(e)
        try {
            // setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/users?search=${search}`, config)
            // console.log(data);
            setLoading(false);
            setSearchResultsUsers(data.users);
            setSearchResultsGroups(data.groupName);
        } catch (error) {
            console.log(error)
        }
    }

    // fetch all conversations
    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/conversation`, config);

            // console.log(data);
            // console.log(groupConversations);
            // setConversations((data.map(friend => friend.isGroupChat ? null : friend.users.find(member => member._id !== user._id))).filter(friend => friend !== null).map(friend => friend));

            setConversations(data.filter(friend => !friend.isGroupChat));
            setGroupConversations(data.filter(friend => friend.isGroupChat && friend.chatName));

            if (!chats.find(chat => chat._id === data.map(datas => datas._id))) {
                dispatch({ type: 'SET_CHATS', payload: data })
            }

        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // fetchAgain
    }, [])

    return (
        <View style={styles.chat}>
            <Navbar user={user} />
            <Search search={search} handleSearch={handleSearch} />
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Chats">
                        {props => <Conversations {...props} user={user} searchResultsUsers={searchResultsUsers} search={search} setSearch={setSearch} conversations={conversations} />}
                    </Tab.Screen>
                    <Tab.Screen name="Groups">
                        {props => <GroupChats {...props} user={user}
                            search={search} setSearch={setSearch} searchResultsGroups={searchResultsGroups} groupConversations={groupConversations} />}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
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