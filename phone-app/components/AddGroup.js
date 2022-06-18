import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, {useState} from 'react'
import UserBadgeItem from './UserBadgeItem'
import UserLists from './UserLists'
import { useContext } from 'react';
import { PhoneAppContext } from '../context/PhoneAppContext';
import axios from 'axios';
import { backend_url } from '../production';

const AddGroup = ({user, setAddGroup }) => {

    const { dispatch, chats } = useContext(PhoneAppContext);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/users?search=${search}`, config)
            // console.log(data.users);
            setLoading(false);
            setSearchResults(data.users);
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        if (!groupChatName || !selectedUsers.length) {
            console.log("Please enter a group chat name and select at least one user");
            return;
        }
        e.preventDefault();
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`${backend_url}/conversation/group`, { name: groupChatName, users: JSON.stringify(selectedUsers.map(u => u._id)) }, config);

            if (!chats.find(chat => chat._id === data._id)) {
                dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
            }

            // setFetchAgain(!fetchAgain);
            setLoading(false);
            setSearch('');
            setGroupChatName('');
            setSelectedUsers([]);
            setSearchResults([]);
            Alert.alert("Group chat created successfully");
        } catch (error) {
            console.log(error)
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            console.log('already added');
        } else {
            setSelectedUsers([...selectedUsers, userToAdd])
        }
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id))
    }

    return (
        <View style={styles.addGroup}>
            <Text style={styles.addGroupHeader}>Create Group Chat</Text>
            <TextInput
                style={styles.addGroupInput}
                placeholder="Enter group name"
                onChangeText={text => setGroupChatName(text)}
                value={groupChatName}
            />
            <TextInput
                style={styles.addGroupInput}
                placeholder="Search Users to Add"
                onChangeText={text => handleSearch(text)}
                value={search}
            />
            <View style={styles.badgeItem}>
                {
                    selectedUsers.map(user =>
                        <UserBadgeItem
                            key={user._id}
                            user={user}
                            handleFunction={() => handleDelete(user)}
                        />
                    )
                }
            </View>
            <ScrollView>
                {loading ? <Text>Loading...</Text>
                    :
                    searchResults?.map(user =>
                        <TouchableOpacity key={user._id}
                            onPress={
                                () => handleGroup(user)
                            }>
                            <UserLists
                                user={user}
                            />
                        </TouchableOpacity>
                    )
                }
            </ScrollView>
            <TouchableOpacity
                style={styles.addGroupButton}
                onPress={handleSubmit}
            >
                <Text
                    style={styles.addGroupButtonText}
                >
                    Create Chat
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.addGroupButton}
                onPress={() => setAddGroup(false)}>
                <Text
                    style={styles.addGroupButtonText}
                >
                    Close
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    addGroup: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addGroupHeader: {
        fontSize: 35,
        fontWeight: 'bold',
        margin: 10,
    },
    addGroupInput: {
        width: '80%',
        height: 50,
        borderWidth: 0.5,
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    addGroupButton: {
        width: '80%',
        height: 50,
        borderWidth: 0.5,
        borderRadius: 10,
        margin: 10,
        padding: 10,
        backgroundColor: '#161216',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addGroupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    badgeItem:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        margin: 10,
    }
})

export default AddGroup