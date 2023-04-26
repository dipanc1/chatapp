import React from 'react'
import Navbar from '../components/UserChat/Navbar'
import Conversations from '../components/UserChat/Conversations'
import Groups from '../components/UserChat/Groups'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import axios from 'axios';
import { backend_url } from '../production';
import { PhoneAppContext } from '../context/PhoneAppContext';
import { SocketContextProvider } from '../context/socketContext';
import Members from '../components/UserChat/Members';
import { RoomProvider } from '../context/RoomContext';
// import Streaming from '../components/Miscellaneous/StreamingPeer';

const Tab = createMaterialTopTabNavigator();

const VideoChat = ({ user, fetchAgain, setFetchAgain, navigation }) => {

    const { chats, dispatch, stream, fullScreen, selectedChat } = React.useContext(PhoneAppContext);

    const [conversations, setConversations] = React.useState([])
    const [groupConversations, setGroupConversations] = React.useState([])
    const [search, setSearch] = React.useState('')
    const [searchResultsUsers, setSearchResultsUsers] = React.useState([])
    const [searchResultsGroups, setSearchResultsGroups] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [meetingId, setMeetingId] = React.useState(null);
    const [token, setToken] = React.useState(null);

    const admin = selectedChat?.isGroupChat && selectedChat?.groupAdmin._id === user._id;

    // console.log(admin, "admin");

    React.useEffect(() => {
        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain, selectedChat])

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
    };
    const sceneContainerStyle = {
        backgroundColor: '#F5F7FB',
    };

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
            setSearchResultsGroups(data.groups);
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

            // console.log("DATA =====", data);
            // console.log(groupConversations);

            setConversations(data.filter(friend => !friend.isGroupChat));
            setGroupConversations(data.filter(friend => friend.isGroupChat && friend.chatName));

            if (!chats.find(chat => chat._id === data.map(datas => datas._id))) {
                dispatch({ type: 'SET_CHATS', payload: data })
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SocketContextProvider>
            {/* <RoomProvider user={user}> */}
            <Navbar user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} search={search} setSearch={setSearch} handleSearch={handleSearch} navigation={navigation} />
            {stream ?
                <>
                    {/* <Streaming admin={admin} user={user} />
                        {!fullScreen && <Members user={user} />} */}
                </>
                :
                <>

                    <Tab.Navigator {...{ screenOptions, sceneContainerStyle }}>
                        <Tab.Screen
                            name="Users"
                        >
                            {props => <Conversations  {...props} user={user} conversations={conversations} search={search} setSearch={setSearch} searchResultsUsers={searchResultsUsers} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                        </Tab.Screen>
                        <Tab.Screen
                            name="Groups"
                            screenOptions={{ presentation: 'modal' }}
                        >
                            {props => <Groups {...props} user={user} groupConversations={groupConversations} search={search} setSearch={setSearch} searchResultsGroups={searchResultsGroups} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                </>
            }
            {/* </RoomProvider> */}
        </SocketContextProvider>
    )
}

export default VideoChat