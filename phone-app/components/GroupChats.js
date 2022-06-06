import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Group from './Group'
import { PhoneAppContext } from '../context/PhoneAppContext'
import GroupLists from './GroupLists'

const GroupChats = ({ groupConversations, searchResultsGroups, search }) => {
    const { dispatch } = React.useContext(PhoneAppContext)
    return (
        <View>
            {search.length > 0 ?
                searchResultsGroups.map(chat => (
                    <TouchableOpacity key={chat._id} onPress={
                        () => accessChat(chat._id)
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
        </View>
    )
}

export default GroupChats