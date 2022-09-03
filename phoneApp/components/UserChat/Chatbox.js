import axios from 'axios'
import { Box, Button, Flex, HStack, Icon, IconButton, Input, ScrollView, Text, VStack } from 'native-base'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import Message from '../Miscellaneous/Message'
import { backend_url } from '../../production'
import { format } from 'timeago.js'

const ENDPOINT = `${backend_url}`;
var socket, selectedChatCompare;

const Chatbox = ({ fetchAgain, setFetchAgain, user }) => {
    const { dispatch, selectedChat } = React.useContext(PhoneAppContext);
    const scrollViewRef = React.useRef();

    const [newMessage, setNewMessage] = React.useState();
    const [profile, setProfile] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

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
            // socket.emit('join chat', selectedChat._id);
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessage = async (event) => {
        // socket.emit("stop typing", selectedChat._id);
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

            // socket.emit("new message", data);
            setMessages([...messages, data]);
            // console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Flex bg={'#fff'} p={2} mx={'4'} flex={'1'}>
            {/* TOP PART  */}
            <HStack justifyContent={'space-between'} alignItems={'center'} h={'16'}>
                <Text style={{color:'primary.600'}} fontWeight={'bold'} fontSize={'lg'} mx={'10'}>
                    {selectedChat?.isGroupChat ? selectedChat?.chatName : profile?.username}
                </Text>
                <IconButton onPress={() => dispatch({ type: 'SET_SELECTED_CHAT', payload: null })} icon={<MaterialIcons name="keyboard-arrow-down" size={24} color={'black'} />} />
            </HStack>

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
                </ScrollView>
            </Box>

            {/* BOTTOM PART */}
            <HStack alignItems={'center'} justifyContent={'space-between'} h={'16'}>
                <Input value={newMessage} outlineColor={'primary.400'} bg={'primary.200'} w={'72'} placeholder={'Type a message'} />
                <IconButton onPress={newMessage !== "" ? sendMessage : null} bg={'primary.300'} icon={<MaterialIcons name="send" size={24} color={'#fff'} />} />
            </HStack>

        </Flex>

    )
}

export default Chatbox