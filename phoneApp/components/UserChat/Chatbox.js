import axios from 'axios'
import { Box, FlatList, Flex, HStack, Icon, IconButton, Input, Popover, Spinner, Text, View } from 'native-base'
import React from 'react'
import notifee from '@notifee/react-native';
import Lottie from 'lottie-react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import Message from '../Miscellaneous/Message'
import { api_key, backend_url, folder, pictureUpload, uploadFile } from '../../utils'
import { format } from 'timeago.js'
import { SocketContext } from '../../context/socketContext'
import animation from '../../assets/typing.json'
import DocumentAttachmentModal from '../UserModals/DocumentAttachmentModal';
import { FILE, IMAGE } from '../../constants';
import { set } from 'react-native-reanimated';

var selectedChatCompare;

const SendFilesOptions = ({ isOpen, setIsOpen, setShowModal, setType }) => {
    return (
        <Popover
            placement={'top'} trigger={triggerProps => {
                return <IconButton {...triggerProps} onPress={() => setIsOpen(true)} colorScheme={'purple'} variant={'outline'} icon={<MaterialIcons name="add" size={24} color={'#9F85F7'} />} />;
            }} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
            <Popover.Content w='16'>
                <Popover.Body>
                    <IconButton icon={<MaterialIcons name="insert-drive-file" size={20} color={'#9F85F7'} />} onPress={
                        () => {
                            setShowModal(true)
                            setType(FILE)
                        }
                    } />
                    <IconButton icon={<MaterialIcons name="image" size={20} color={'#9F85F7'} />} onPress={() => {
                        setShowModal(true)
                        setType(IMAGE)
                    }} />
                </Popover.Body>
            </Popover.Content>
        </Popover>
    )
}

const Chatbox = ({ user }) => {
    const socket = React.useContext(SocketContext);

    const { dispatch, selectedChat, stream, userInfo, notification, timestamp, signature } = React.useContext(PhoneAppContext);

    const [online, setOnline] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [page, setPage] = React.useState(2);
    const [socketConnected, setSocketConnected] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState();
    const [profile, setProfile] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [hasMore, setHasMore] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [typing, setTyping] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [selectedFile, setSelectedFile] = React.useState(null);

    const [type, setType] = React.useState('');


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
                setMessages(prev => [newMessageReceived, ...prev]);
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

    const sendMessage = async (event, url) => {
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
                content: url !== null ? url : newMessage,
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

    const fileUploadAndSend = (file) => {
        setLoading(true)
        let apiUrl = type === IMAGE ? pictureUpload : uploadFile;
        const data = new FormData()
        data.append('api_key', api_key)
        data.append('file', file);
        data.append('folder', folder)
        data.append('timestamp', timestamp)
        data.append('signature', signature)
        fetch(apiUrl, {
            method: "post",
            body: data
        }).then(res => res.json()).
            then(data => {
                setSelectedImage(null)
                setSelectedFile(null)
                setShowModal(false)
                sendMessage(null, data.secure_url)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
                alert("An Error Occured While Uploading")
            })
    }


    return (
        <>
            <Flex bg={'#fff'} p={2} mx={'4'} flex={1}>
                {/* TOP PART  */}
                {!stream &&
                    <HStack justifyContent={'space-between'} alignItems={'center'} h={'16'}>

                        <Text fontWeight={'bold'} fontSize={'lg'} mx={'5'}>
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
                        renderItem={({ item, index }) => (
                            <Message
                                profile={profile}
                                messages={item}
                                own={item.sender._id === userInfo?._id}

                                sameSender={(index < messages.length - 1 &&
                                    (messages[index + 1].sender._id !== item.sender._id ||
                                        messages[index + 1].sender._id === undefined) &&
                                    messages[index].sender._id !== userInfo._id) || (index === messages.length - 1 &&
                                        messages[messages.length - 1].sender._id !== userInfo._id &&
                                        messages[messages.length - 1].sender._id)}

                                sameTime={(index < messages.length - 1) && format(new Date(messages[index].createdAt).valueOf()) === format(new Date(messages[index + 1].createdAt).valueOf())}
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
                    <SendFilesOptions isOpen={isOpen} setIsOpen={setIsOpen} setShowModal={setShowModal} setType={setType} />
                    <Input value={newMessage} bg={'primary.200'} w={'70%'} placeholder={'Type a message'} onChangeText={typingHandler} />
                    <IconButton onPress={newMessage !== "" ? e => sendMessage(e, null) : null} bg={'primary.300'} icon={<MaterialIcons name="send" size={24} color={'#fff'} />} />
                </HStack>
            </Flex>
            <DocumentAttachmentModal
                showModal={showModal}
                setShowModal={setShowModal}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                fileUploadAndSend={fileUploadAndSend}
                type={type}
                loading={loading}
            />
        </>

    )
}

export default Chatbox