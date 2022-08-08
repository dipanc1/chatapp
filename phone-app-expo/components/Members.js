import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert } from 'react-native'
import React from 'react'
import ChatOnline from './ChatOnline'
import { AntDesign } from '@expo/vector-icons';
import { PhoneAppContext } from '../context/PhoneAppContext';
import { backend_url } from '../production';
import UserLists from './UserLists';
import axios from 'axios';

const Members = ({ setMembers, user, fetchAgain, setFetchAgain }) => {

    const { selectedChat, dispatch } = React.useContext(PhoneAppContext);
    const [show, setShow] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [loading, setLoading] = React.useState(false)

    const windowWidth = Dimensions.get('window').width;

    const handleAddUser = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            return Alert.alert("You are not the admin")
        }
        // console.warn("USER ID TO ADD", selectedChat.users.map(user => user._id).includes(user1));
        if (selectedChat.users.map(user => user._id).includes(user1)) {
            return Alert.alert('User already in chat')
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
                    chatId: selectedChat._id,
                    userId: user1,
                },
                config
            );
            console.log(data);
            Alert.alert('User added to chat');
            dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        setSearch('');

    }

    const handleSearch = async (e) => {
        setSearch(e);
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/users?search=${search}`, config)
            setSearchResults(data.users);
            // console.log(searchResults);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            return Alert.alert('You are not the admin of this group chat')
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${backend_url}/conversation/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? dispatch({ type: 'SET_SELECTED_CHAT', payload: '' }) : dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
            // setFetchAgain(!fetchAgain);
            setLoading(false);
            Alert.alert('User removed from group chat');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.groupContainer}>
            {/* Top  */}
            {!show ?
                <View style={styles.groupHeader}>
                    <AntDesign
                        name="back"
                        size={24}
                        color="black"
                        onPress={() => setMembers(false)}
                    />
                    {selectedChat.isGroupChat ?
                        <Text style={styles.groupHeaderText}>
                            {selectedChat?.users.length} Group members
                        </Text>
                        :
                        <Text style={styles.headerText}>
                            {selectedChat?.users.find(member => member._id !== user._id)?.username}
                        </Text>
                    }
                </View>
                :
                <View style={styles.searchMember}>
                    <AntDesign
                        name="back"
                        size={24}
                        color="black"
                        onPress={() => setShow(false)}
                    />
                    <TextInput
                        style={{
                            height: 40,
                            width: windowWidth - 60,
                            borderColor: 'gray',
                            borderWidth: 1,
                            margin: 10,
                            padding: 10,
                            borderRadius: 5,
                            backgroundColor: '#f8f8f8',
                        }}
                        placeholder="Search for a member to add"
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>
            }

            {/* Middle  */}
            <ScrollView>
                {!show ?
                    selectedChat.isGroupChat && selectedChat?.users.map(u =>
                        <View key={u._id}>
                            <ChatOnline
                                user1={u}
                                user={user}
                                handleFunction={() => handleRemove(u)}
                            />
                        </View>
                    )
                    :
                    search.length > 0 &&
                    searchResults?.map(user => (
                        <TouchableOpacity key={user._id} onPress={() => handleAddUser(user._id)}>
                            <UserLists user={user} />
                        </TouchableOpacity>
                    ))
                }

            </ScrollView>

            {/* Bottom */}
            {!show && selectedChat.isGroupChat &&
                <View style={styles.groupFooter}>
                    <TouchableOpacity onPress={() => setShow(true)} style={styles.footerButton}>
                        <Text style={styles.footerText}>
                            +{' '}  Add new member
                        </Text>
                    </TouchableOpacity>
                </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    groupContainer: {
        flex: 1
    },
    groupHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    groupHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerText: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    groupFooter: {
        margin: 20,
    },
    footerButton: {
        padding: 15,
        borderRadius: 30,
        backgroundColor: '#161216',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchMember: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
    }
})

export default Members