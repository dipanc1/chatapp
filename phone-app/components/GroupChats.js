import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React from 'react'
import Group from './Group'
import { PhoneAppContext } from '../context/PhoneAppContext'
import GroupLists from './GroupLists'

const GroupChats = ({ user, groupConversations, searchResultsGroups, search }) => {
    const { dispatch } = React.useContext(PhoneAppContext)

    const handleAddUser = async (user1, groupId) => {
        const res = searchResultsGroups.map(group => group.users).includes(user1);
        console.log(user1)
        console.log(res);
        if (res) {
            Alert.alert('User already in chat')
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${backend_url}/conversation/groupadd`,
                {
                    chatId: groupId,
                    userId: user1,
                },
                config
            );
            console.log(data);
            dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        setSearch('');

    }


    return (
        <View>
            <ScrollView>
                {search.length > 0 ?
                    searchResultsGroups.map(chat => (
                        <TouchableOpacity key={chat._id} onPress={
                            () => handleAddUser(user._id, chat._id)
                        }>
                            <GroupLists chat={chat} />
                        </TouchableOpacity>
                    )) :
                    groupConversations.map(c => (
                        <TouchableOpacity
                            key={c._id}
                            onPress={() => {
                                dispatch({ type: "SET_SELECTED_CHAT", payload: c })
                                dispatch({ type: "SET_MOBILE" })
                            }}
                        >
                            <Group chat={c} />
                        </TouchableOpacity>
                    ))}
            </ScrollView>
        </View>
    )
}

export default GroupChats