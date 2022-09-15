import axios from 'axios'
import { Box, Button, Flex, HStack, Icon, IconButton, Input, ScrollView, Text, VStack } from 'native-base'
import React from 'react'
import Lottie from 'lottie-react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import Message from '../Miscellaneous/Message'
import { backend_url } from '../../production'
import { format } from 'timeago.js'
import { SocketContext } from '../../context/socketContext'
import animation from '../../assets/animation.json'
import StreamModal from '../UserModals/StreamModal'

var selectedChatCompare;

const Chatbox = ({ fetchAgain, setFetchAgain, user, getMeetingAndToken }) => {
    const socket = React.useContext(SocketContext);
    const { dispatch, selectedChat, stream } = React.useContext(PhoneAppContext);
    const scrollViewRef = React.useRef();
    const [socketConnected, setSocketConnected] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState();
    const [profile, setProfile] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [typing, setTyping] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        // user online
        socket.emit("user-online", user);
    }, []);

    React.useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    dispatch({ type: 'SET_NOTIFICATION', payload: [newMessageReceived] });
                    //   console.log(newMessageReceived);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    });


    React.useEffect(() => {
        try {
            setProfile(selectedChat?.users.find(member => member._id !== user._id));
        } catch (error) {
            console.log(error);
        }

        fetchMessages();

        selectedChatCompare = selectedChat;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat]);

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            };
            setLoading(true);
            const { data } = await axios.get(`${backend_url}/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            //TODO: ADD ALERTS
            console.log(error);
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

            socket.emit("new message", data);
            setMessages([...messages, data]);
            // console.log(data);
        } catch (error) {
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

    const handleStream = () => {
        setOpen(true);
    }

    return (
        <>
            <Flex bg={'#fff'} p={2} mx={'4'} flex={1}>
                {/* TOP PART  */}
                {!stream &&
                    <HStack justifyContent={'space-between'} alignItems={'center'} h={'16'}>
                        <Text style={{ color: 'primary.600' }} fontWeight={'bold'} fontSize={'lg'} mx={'10'}>
                            {selectedChat?.isGroupChat ? selectedChat?.chatName : profile?.username}
                        </Text>
                        <IconButton onPress={() => dispatch({ type: 'SET_SELECTED_CHAT', payload: null })} icon={<MaterialIcons name="keyboard-arrow-down" size={24} color={'black'} />} />

                        {selectedChat?.isGroupChat &&
                            <IconButton onPress={handleStream} icon={<MaterialIcons name="videocam" size={24} color={'black'} />} />
                        }

                    </HStack>
                }
                {/* MIDDLE PART */}
                <Box flex={'1'}>
                    <ScrollView
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >
                        {messages?.map((m, i) => (
                            <Message
                                profile={profile}
                                key={m._id}
                                messages={m}
                                own={m.sender._id === user._id}
                                sameSender={(i < messages.length - 1 &&
                                    (messages[i + 1].sender._id !== m.sender._id ||
                                        messages[i + 1].sender._id === undefined) &&
                                    messages[i].sender._id !== user._id) || (i === messages.length - 1 &&
                                        messages[messages.length - 1].sender._id !== user._id &&
                                        messages[messages.length - 1].sender._id)}
                                sameTime={(i < messages.length - 1) && format(messages[i].createdAt) === format(messages[i + 1].createdAt)}
                            />
                        ))}
                        {isTyping ? (
                            <View>
                                <Lottie source={animation} autoPlay loop />
                            </View>
                        ) : (
                            <></>
                        )}
                    </ScrollView>
                </Box>

                {/* BOTTOM PART */}
                <HStack alignItems={'center'} justifyContent={'space-between'} h={'16'}>
                    <Input value={newMessage} outlineColor={'primary.400'} bg={'primary.200'} w={'72'} placeholder={'Type a message'} onChangeText={typingHandler} />
                    <IconButton onPress={newMessage !== "" ? sendMessage : null} bg={'primary.300'} icon={<MaterialIcons name="send" size={24} color={'#fff'} />} />
                </HStack>

            </Flex>

            <StreamModal user={user} getMeetingAndToken={getMeetingAndToken} open={open} setOpen={setOpen} />
        </>

    )
}

export default Chatbox