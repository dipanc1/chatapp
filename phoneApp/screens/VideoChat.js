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

    const { chats, dispatch, stream, selectedChat, userInfo } = React.useContext(PhoneAppContext);

    const [conversations, setConversations] = React.useState([])
    const [groupConversations, setGroupConversations] = React.useState([])
    const [search, setSearch] = React.useState('')

    const [hasMoreGroupChats, setHasMoreGroupChats] = React.useState(true);
    const [groupChatsPage, setGroupChatsPage] = React.useState(2);

    const [hasMoreOneOnOneChats, setHasMoreOneOnOneChats] = React.useState(true);
    const [oneOnOneChatsPage, setOneOnOneChatsPage] = React.useState(2);

    const [searchResultsUsers, setSearchResultsUsers] = React.useState([])
    const [searchResultsGroups, setSearchResultsGroups] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [meetingId, setMeetingId] = React.useState(null);
    const [token, setToken] = React.useState(null);

    const admin = selectedChat?.isGroupChat && selectedChat?.groupAdmin._id === userInfo?._id;

    React.useEffect(() => {

        fetchGroupChats();
        fetchOneOnOneChats();
        setOneOnOneChatsPage(2);
        setGroupChatsPage(2);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain]);

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
        tabBarIndicatorStyle: {
            backgroundColor: '#9F85F7',
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
            setLoading(false);
            setSearchResultsUsers(data.users);
            setSearchResultsGroups(data.groups);
        } catch (error) {
            console.log(error)
        }
    }

    const axiosJwt = axios.create({
        baseURL: backend_url,
    });

    const fetchOneOnOneChats = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosJwt.get(
                `/conversation/one-on-one/1`, config
            );

            setConversations(data.chats);
            setHasMoreOneOnOneChats(data.hasMore);

            if (
                !chats.find(
                    (chat) => chat._id === data.chats.map((datas) => datas._id)
                )
            ) {
                dispatch({ type: "SET_CHATS", payload: data });
            }

        } catch (error) {
            console.log(error)
        }
    };

    const fetchGroupChats = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosJwt.get(
                `/conversation/group-chats/1`, config
            );

            setGroupConversations(data.groups);
            setHasMoreGroupChats(data.hasMore);

            if (
                !chats.find(
                    (chat) => chat._id === data.groups.map((datas) => datas._id)
                )
            ) {
                dispatch({ type: "SET_CHATS", payload: data });
            }

        } catch (error) {
            console.log(error)
        }
    };

    const fetchMoreOneOnOneChats = async () => {
        setOneOnOneChatsPage(oneOnOneChatsPage + 1);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosJwt.get(
                `/conversation/one-on-one/${oneOnOneChatsPage}`, config
            );

            setConversations([...conversations, ...data.chats]);
            setHasMoreOneOnOneChats(data.hasMore);


            if (
                !chats.find(
                    (chat) => chat._id === data.chats.map((datas) => datas._id)
                )
            ) {
                dispatch({ type: "SET_CHATS", payload: data });
            }
        } catch (error) {
            console.log(error)
        }
    };

    const fetchMoreGroupChats = async () => {
        setGroupChatsPage(groupChatsPage + 1);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosJwt.get(
                `/conversation/group-chats/${groupChatsPage}`, config
            );

            setGroupConversations([...groupConversations, ...data.groups]);
            setHasMoreGroupChats(data.hasMore);

            if (
                !chats.find(
                    (chat) => chat._id === data.groups.map((datas) => datas._id)
                )
            ) {
                dispatch({ type: "SET_CHATS", payload: data });
            }
        } catch (error) {
            console.log(error)
        }
    };

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
                            {props => <Conversations  {...props} hasMoreOneOnOneChats={hasMoreOneOnOneChats} user={user} conversations={conversations} search={search} setSearch={setSearch} searchResultsUsers={searchResultsUsers} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} navigation={navigation} fetchMoreOneOnOneChats={fetchMoreOneOnOneChats} />}
                        </Tab.Screen>
                        <Tab.Screen
                            name="Groups"
                            screenOptions={{ presentation: 'modal' }}
                        >
                            {props => <Groups {...props} hasMoreGroupChats={hasMoreGroupChats} user={user} groupConversations={groupConversations} search={search} setSearch={setSearch} searchResultsGroups={searchResultsGroups} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} navigation={navigation} admin={admin} fetchMoreGroupChats={fetchMoreGroupChats} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                </>
            }
            {/* </RoomProvider> */}
        </SocketContextProvider>
    )
}

export default VideoChat