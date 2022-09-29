import React from 'react'
import Navbar from '../components/UserChat/Navbar'
import Conversations from '../components/UserChat/Conversations'
import Groups from '../components/UserChat/Groups'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native'
import Searchbar from '../components/Miscellaneous/Searchbar';
import axios from 'axios';
import { backend_url } from '../production';
import { PhoneAppContext } from '../context/PhoneAppContext';
import { SocketContextProvider } from '../context/socketContext';
import Streaming from '../components/Miscellaneous/Streaming';
import Members from '../components/UserChat/Members';
import { MeetingProvider, MeetingConsumer } from '@videosdk.live/react-sdk';

const Tab = createMaterialTopTabNavigator();

const Chat = ({ user, fetchAgain, setFetchAgain }) => {
    const { chats, dispatch, stream, fullScreen } = React.useContext(PhoneAppContext);
    const [conversations, setConversations] = React.useState([])
    const [groupConversations, setGroupConversations] = React.useState([])
    const [search, setSearch] = React.useState('')
    const [searchResultsUsers, setSearchResultsUsers] = React.useState([])
    const [searchResultsGroups, setSearchResultsGroups] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [meetingId, setMeetingId] = React.useState(null);
    const [token, setToken] = React.useState(null);

    React.useEffect(() => {
        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain])

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

    React.useEffect(() => {
        const getToken = async () => {
            try {
                const response = await fetch(`${backend_url}/meetings/get-token`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                const { token } = await response.json();
                setToken(token);
            } catch (e) {
                console.log(e);
            }
        };
        getToken();
    }, [])

    const getMeetingId = async (token) => {
        // console.warn("Token ::: >>>", token);
        try {
            const VIDEOSDK_API_ENDPOINT = `${backend_url}/meetings/create-meeting`;
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, region: "in002" }),
            };
            const response = await fetch(VIDEOSDK_API_ENDPOINT, options)
                .then(async (result) => {
                    const { meetingId } = await result.json();
                    return meetingId;
                })
                .catch((error) => console.log("error", error));
            return response;
        } catch (e) {
            console.log(e);
        }
    };


    const getMeetingAndToken = async (id) => {
        const meetingId =
            id == null ? await getMeetingId(token) : id;
        setMeetingId(meetingId);
        // console.warn("Meeting Id ::: >>>", meetingId, typeof meetingId)
    };


    return (
        <SocketContextProvider>
            <NavigationContainer>

                <Navbar user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                {stream ?
                    <MeetingProvider
                        config={{
                            meetingId,
                            micEnabled: false,
                            webcamEnabled: true,
                            name: user.username
                        }}
                        token={token}
                    >
                        <MeetingConsumer>
                            {() =>
                                <Streaming fetchAgain={fetchAgain} user={user} meetingId={meetingId} setFetchAgain={setFetchAgain} />
                            }
                        </MeetingConsumer>
                        {!fullScreen && <Members user={user} />}
                    </MeetingProvider>
                    :
                    <>
                        <Searchbar search={search} handleSearch={handleSearch} placeholder={"Search People or Groups"} />

                        <Tab.Navigator {...{ screenOptions, sceneContainerStyle }}>
                            <Tab.Screen
                                name="Conversations"
                            >
                                {props => <Conversations  {...props} user={user} conversations={conversations} search={search} setSearch={setSearch} searchResultsUsers={searchResultsUsers} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                            </Tab.Screen>
                            <Tab.Screen
                                name="Groups"
                                screenOptions={{ presentation: 'modal' }}
                            >
                                {props => <Groups {...props} user={user} groupConversations={groupConversations} search={search} setSearch={setSearch} searchResultsGroups={searchResultsGroups} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} getMeetingAndToken={getMeetingAndToken} />}
                            </Tab.Screen>
                        </Tab.Navigator>
                    </>
                }
            </NavigationContainer>
        </SocketContextProvider>
    )
}

export default Chat