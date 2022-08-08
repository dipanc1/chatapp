import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import axios from 'axios'
import Conversation from './Conversation'
import UserLists from './UserLists'
import { backend_url } from '../production'
import { PhoneAppContext } from '../context/PhoneAppContext'

const Conversations = ({ conversations, user, searchResultsUsers, search, setSearch }) => {
    const { dispatch, selectedChat } = React.useContext(PhoneAppContext)

    // add user to conversation
    const accessChat = async (userId) => {
        // console.log(userId);
        try {
            // setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`${backend_url}/conversation`, { userId }, config);

            dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
            // console.log(data);
            // setLoading(false);
            setSearch('');
            // setFetchAgain(!fetchAgain);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <View>
            <ScrollView>
                {search.length > 0 ?
                    searchResultsUsers.map(user => (
                        <TouchableOpacity key={user._id} onPress={
                            () => accessChat(user._id)
                        }>
                            <UserLists user={user} />
                        </TouchableOpacity>
                    )) :

                    conversations.map(c => (
                        <TouchableOpacity key={c._id}
                            onPress={() => {
                                dispatch({ type: "SET_SELECTED_CHAT", payload: c })
                            }}
                        >
                            <Conversation user={user} chat={c} />
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>
        </View>
    )
}



export default Conversations