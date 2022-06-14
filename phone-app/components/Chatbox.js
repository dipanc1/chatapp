import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native'
import React, { useRef } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Message from './Message';
import { PhoneAppContext } from '../context/PhoneAppContext';
import { backend_url } from '../production';
import axios from 'axios';
import animationData from '../animations/typing.json';
import LottieView from 'lottie-react-native';
import { format } from 'timeago.js'
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { io } from 'socket.io-client';

const ENDPOINT = `${backend_url}`;
var socket, selectedChatCompare;

const Chatbox = ({ fetchAgain, setFetchAgain, user, setMembers }) => {

    const { selectedChat, dispatch, notification } = React.useContext(PhoneAppContext);
    const animation = useRef(null);
    const scrollViewRef = useRef();
    const [profile, setProfile] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState();
    const [socketConnected, setSocketConnected] = React.useState(false);
    const [typing, setTyping] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);

    const [rename, setRename] = React.useState(false);
    const [groupChatName, setGroupChatName] = React.useState('');
    const [renameLoading, setRenameLoading] = React.useState(false);

    React.useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        // user online
        socket.emit("user-online", user._id);
    }, []);

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

    React.useEffect(() => {
        try {
            setProfile(selectedChat?.users.find(member => member._id !== user._id));
        } catch (error) {
            console.log(error);
        }

        fetchMessages();
        // setStreaming(false);
        // setVideocall(false);

        selectedChatCompare = selectedChat;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat])

    React.useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    dispatch({ type: 'SET_NOTIFICATION', payload: [newMessageReceived] });
                    // console.log(newMessageReceived);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    });


    const handleRename = async () => {
        if (!groupChatName) {
            return
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const body = {
                chatName: groupChatName,
                chatId: selectedChat._id
            }
            const { data } = await axios.put(`${backend_url}/conversation/rename`, body, config)
            dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
            Alert.alert(`Group chat renamed to ${groupChatName}`)
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            setGroupChatName('');
            setRename(false);
        } catch (err) {
            console.log(err)
            setRenameLoading(false);
        }
    }

    return (
        <View style={styles.chatbox}>

            {/* top part  */}
            <View style={styles.menuDetails}>

                <View style={styles.name}>
                    <AntDesign
                        name="back"
                        size={24}
                        color="black"
                        onPress={() => dispatch({ type: 'SET_SELECTED_CHAT', payload: null })}
                    />
                    {
                        selectedChat?.isGroupChat ?
                            null :
                            <Image
                                source={{
                                    uri: profile?.pic
                                }}
                                style={styles.avatar}
                            />
                    }
                    {
                        !rename &&
                        <Text style={styles.username}>{selectedChat?.isGroupChat ? selectedChat?.chatName : profile?.username}</Text>
                    }
                    {rename &&
                        <>
                            <TextInput
                                value={groupChatName}
                                onChangeText={(text) => setGroupChatName(text)}
                                style={styles.groupChatName}
                            />
                            <TouchableOpacity onPress={handleRename} style={styles.groupChatNameButton}>
                                <Text style={styles.save}>Rename</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRename(!rename)} style={styles.groupChatNameCancelButton}>
                                <Text style={styles.save}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    }
                    {selectedChat?.isGroupChat && !rename ?
                        <FontAwesome5 name="pencil-alt" size={16} color="black" onPress={
                            () => setRename(!rename)
                        } style={{ marginLeft: 8 }} />
                        : null}
                </View>
                <TouchableOpacity onPress={() => setMembers(true)}>
                    <Entypo name="dots-three-vertical" size={24} color="black" />
                </TouchableOpacity>

            </View>

            {/* middle part  */}
            <SafeAreaView style={styles.chat}>
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>

                    {messages?.map((m, i) => (
                        <Message
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
                            <LottieView
                                loop={true}
                                style={{
                                    width: '7vw',
                                }}
                                animationData={animationData}
                            />
                        </View>
                    ) : (
                        <></>
                    )}
                </ScrollView>
            </SafeAreaView>

            {/* bottom part  */}
            <View style={styles.sendMessage}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    placeholderTextColor="black"
                    underlineColorAndroid="transparent"
                    onChangeText={typingHandler}
                    value={newMessage}
                />
                <TouchableOpacity onPress={newMessage !== "" ? sendMessage : null}>
                    <Ionicons name="send" size={24} color="black" style={styles.button} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    groupChatName: {
        borderWidth: 0.7,
        padding: 5,
        // minWidth:100,
        width: 150,
        marginLeft: 10,
        borderRadius: 10,
        fontSize: 16,
        color: 'black'
    },
    groupChatNameButton: {
        marginLeft: 10,
        borderRadius: 10,
        backgroundColor: '#00b894',
        padding: 6,
    },
    groupChatNameCancelButton: {
        marginLeft: 10,
        borderRadius: 10,
        backgroundColor: '#e53e3e',
        padding: 6,
    },
    save: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    chatbox: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    menuDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        flex: 1,
    },
    name: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    chat: {
        flex: 9,
        padding: 10,
    },
    sendMessage: {
        flex: 1,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    button: {
        marginLeft: 10,
    },
})

export default Chatbox