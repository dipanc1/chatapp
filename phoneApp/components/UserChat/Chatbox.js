import axios from 'axios'
import { Box, FlatList, Flex, HStack, Icon, IconButton, Input, Spinner, Text, View } from 'native-base'
import React from 'react'
import notifee from '@notifee/react-native';
import Lottie from 'lottie-react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import Message from '../Miscellaneous/Message'
import { backend_url } from '../../production'
import { format } from 'timeago.js'
import { SocketContext } from '../../context/socketContext'
import animation from '../../assets/typing.json'

var selectedChatCompare;

const Chatbox = ({ user }) => {
    const socket = React.useContext(SocketContext);

    const { dispatch, selectedChat, stream, userInfo, notification } = React.useContext(PhoneAppContext);

    const [online, setOnline] = React.useState(false);
    const [page, setPage] = React.useState(2);
    const [socketConnected, setSocketConnected] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState();
    const [profile, setProfile] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [hasMore, setHasMore] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [typing, setTyping] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);


    async function onDisplayNotification(newMessageReceived) {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
            title: newMessageReceived.sender.username,
            body: newMessageReceived.sender.username + ": " + newMessageReceived.content,
            android: {
                channelId,
                person: {
                    name: newMessageReceived.sender.username,
                    icon: newMessageReceived.sender.pic,
                },
                // actions: [
                //     {
                //         title: 'Reply',
                //         pressAction: {
                //             id: 'reply',
                //         },
                //         icon: 'ic_launcher',
                //         input: true,
                //         placeholder: 'Type your reply',
                //     },
                // ],
            },
        });
    }

    React.useEffect(() => {
        socket.emit("setup", userInfo);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        // user online
        socket.emit("user-online", userInfo);
    }, []);

    React.useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    dispatch({ type: 'SET_NOTIFICATION', payload: [...notification, newMessageReceived] })
                    onDisplayNotification(newMessageReceived);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    }, []);


    React.useEffect(() => {
        try {
            setProfile(selectedChat?.users.find(member => member._id !== userInfo?._id));
        } catch (error) {
            alert('Failed to Load the Profile')
        }
        if (selectedChat && !selectedChat.isGroupChat) {
            CheckOnlineStatus(selectedChat?.users.find(member => member._id !== userInfo?._id)._id);
        }

        fetchMessages();

        setPage(2);

        selectedChatCompare = selectedChat;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat])

    const fetchMessages = async () => {
        if (!selectedChat) return;
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`${backend_url}/message/${selectedChat._id}/1`, config);
            setMessages(data.messages);
            setHasMore(data.hasMore);
            socket.emit('join chat', selectedChat._id);
            setLoading(false);
        } catch (error) {
            alert('Failed to Load Messages');
            setLoading(false);
            console.log(error);
        }
    }

    const fetchMoreMessages = async () => {
        if (!selectedChat) return;
        setPage(page + 1);
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`${backend_url}/message/${selectedChat._id}/${page}`, config);
            setMessages([...messages, ...data.messages]);
            setHasMore(data.hasMore);
            setLoading(false);
        } catch (error) {
            console.log(error);
            alert('Failed to Load Messages');
            setLoading(false);
        }
    }

    const sendMessage = async (event) => {
        socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            };
            setNewMessage('');
            const { data } = await axios.post(`${backend_url}/message`, {
                content: newMessage,
                chatId: selectedChat._id
            }, config);

            socket.emit("new message", data.message);
            setMessages([data.message, ...messages]);
        } catch (error) {
            alert('Failed to Send Message');
            console.log(error);
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e);

        // typing indicator logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var typingTimer = 1500;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeElapsed = timeNow - lastTypingTime;
            if (timeElapsed >= typingTimer && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, typingTimer);
    }

    const CheckOnlineStatus = async (friendId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${backend_url}/users/check-online/${friendId}`, config)
            setOnline(data.isOnline);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <Flex bg={'#fff'} p={2} mx={'4'} flex={1}>
                {/* TOP PART  */}
                {!stream &&
                    <HStack justifyContent={'space-between'} alignItems={'center'} h={'16'}>

                        <Text color={'primary.600'} fontWeight={'bold'} fontSize={'lg'} mx={'5'}>
                            {selectedChat?.isGroupChat ? selectedChat?.chatName : profile?.username}
                        </Text>

                        {!selectedChat?.isGroupChat && <Text color={'primary.600'} fontWeight={'bold'} fontSize={'lg'} mx={'10'}>
                            {online ? 'Online' : 'Offline'}
                        </Text>}

                        <IconButton onPress={() => {
                            dispatch({ type: 'SET_SELECTED_CHAT', payload: null })
                        }
                        } icon={<MaterialIcons name="keyboard-arrow-down" size={24} color={'black'} />} />

                    </HStack>
                }
                {/* MIDDLE PART */}
                <Box flex={'1'}>
                    <FlatList
                        onEndReached={fetchMoreMessages}
                        onEndReachedThreshold={0.5}
                        inverted
                        keyExtractor={(m) => m._id}
                        ListFooterComponent={hasMore ? <Spinner size={'lg'} color={'primary.300'} /> : null}
                        data={messages}
                        renderItem={({ item, i }) => (
                            <Message
                                profile={profile}
                                messages={item}
                                own={item.sender._id === userInfo?._id}
                                sameSender={(i < messages.length - 1 &&
                                    (messages[i + 1].sender._id !== item.sender._id ||
                                        messages[i + 1].sender._id === undefined) &&
                                    messages[i].sender._id !== userInfo?._id) || (i === messages.length - 1 &&
                                        messages[messages.length - 1].sender._id !== userInfo?._id &&
                                        messages[messages.length - 1].sender._id)}
                                sameTime={(i < messages.length - 1) && format(messages[i].createdAt) === format(messages[i + 1].createdAt)}
                                user={user}
                            />
                        )}
                    />
                    {isTyping ? (
                        <View>
                            <Lottie source={animation} autoPlay loop />
                        </View>
                    ) : (
                        <></>
                    )}

                </Box>

                {/* BOTTOM PART */}
                <HStack alignItems={'center'} justifyContent={'space-between'} h={'16'}>
                    <Input value={newMessage} bg={'primary.200'} w={'72'} placeholder={'Type a message'} onChangeText={typingHandler} />
                    <IconButton onPress={newMessage !== "" ? sendMessage : null} bg={'primary.300'} icon={<MaterialIcons name="send" size={24} color={'#fff'} />} />
                </HStack>
            </Flex>
        </>

    )
}

export default Chatbox