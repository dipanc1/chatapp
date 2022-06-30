import axios from 'axios'
import React from 'react'
import { io } from 'socket.io-client'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import Message from '../message/Message'
import "./chatbox.scss"
import Loading from '../Loading'
import Lottie from "lottie-react";
import animationData from '../../animations/typing.json'
import DetailsModal from '../detailsmodal/DetailsModal'
import { format } from 'timeago.js'
import Stream from '../stream/Stream'
import { backend_url } from '../../production'
import { motion } from 'framer-motion'
import { Avatar, AvatarBadge, Box, Button, Divider, Image, Input, Spinner, Text } from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'

const ENDPOINT = `${backend_url}`;
var socket, selectedChatCompare;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { selectedChat, notification, dispatch, mobile } = React.useContext(PhoneNumberContext);
  const [profile, setProfile] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState();
  const [socketConnected, setSocketConnected] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [online, setOnline] = React.useState(false);
  const [calling, setCalling] = React.useState(false);
  const [isCalling, setIsCalling] = React.useState(false);
  const [videocall, setVideocall] = React.useState(true);
  const [streaming, setStreaming] = React.useState(false);
  const [fullScreenMode, setFullScreenMode] = React.useState(false);
  const scrollRef = React.useRef();

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
    if (event.key === "Enter" || event.type === "click") {
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
  }

  React.useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // user online
    socket.emit("user-online", user._id);
  }, []);


  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  React.useEffect(() => {
    try {
      setProfile(selectedChat?.users.find(member => member._id !== user._id));
    } catch (error) {
      console.log(error);
    }

    fetchMessages();
    setStreaming(false);
    setVideocall(false);

    selectedChatCompare = selectedChat;
    socket.on("user-online", (userId) => {
      console.warn(userId, "USER ONLINE");
      if (selectedChat?.users.find(member => member._id === userId)) {
        setOnline(true);
      }
    });
    socket.on("user-offline", (userId) => {
      console.warn(userId, "USER OFFLINE");
      if (selectedChat?.users.find(member => member._id === userId)) {
        setOnline(false);
      }
    });

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


  const typingHandler = (e) => {
    setNewMessage(e.target.value);

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

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  }

  return (
    <Box
      height={'628px'}
      bg={'white'}
      p={'1.5'}
      my={'5'}
      mx={'10'}
      borderRadius={'xl'}
      boxShadow={'dark-lg'}
    >
      {
        selectedChat ?
          (<>
            {/* TOP PART  */}
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              my={2}
              mx={6}
              initial="hidden"
              animate="visible"
              variants={variants}
            >

              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                initial="hidden"
                animate="visible"
                variants={variants}
                style={{ margin: selectedChat?.isGroupChat ? '8px' : null }}>
                {selectedChat?.isGroupChat ?
                  null :
                  <Avatar
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    size='md'
                    name={profile?.username}
                    src={profile?.pic}
                  >
                    {online ?
                      <AvatarBadge boxSize='1em' bg='green.500' />
                      : <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='1em' />}
                  </Avatar>
                }
                {
                  streaming ?
                    null :

                    <Text
                      initial="hidden"
                      animate="visible"
                      variants={variants}
                      ml={'4'}
                      fontSize={'xl'}
                      fontWeight={'bold'}
                    >
                      {selectedChat?.isGroupChat ? selectedChat?.chatName.toUpperCase() : profile?.username}
                    </Text>
                }
              </Box>

              {selectedChat?.isGroupChat &&
                <Box>
                  <Stream streaming={streaming} setStreaming={setStreaming} fullScreenMode={fullScreenMode} setFullScreenMode={setFullScreenMode} calling={calling} setCalling={setCalling} isCalling={isCalling} setIsCalling={setIsCalling} socket={socket} videocall={videocall} setVideocall={setVideocall} />
                </Box>

              }
              {/* for mobile yet to edit  */}
              {/* <div className="chatboxGroupModal">
                <DetailsModal />
              </div> */}

            </Box>

            <Divider orientation='horizontal' />


            {/* MIDDLE PART  */}
            <Box
              initial="hidden"
              animate="visible"
              variants={variants}
              height={'md'}
              overflowY={'scroll'}
            >
              {loading ?
                (
                  <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mt={44}>
                    <Spinner
                      thickness='4px'
                      speed='0.2s'
                      emptyColor='gray.200'
                      color='buttonPrimaryColor'
                      size='xl'
                    />
                  </Box>
                ) :
                (messages?.map((m, i) => (
                  <Box
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    key={m._id}
                    ref={scrollRef}>
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
                  </Box>
                )))
              }
              {isTyping ? (
                <Box>
                  <Lottie
                    loop={true}
                    style={{
                      width: '7vw',
                    }}
                    animationData={animationData}
                  />
                </Box>
              ) : (
                <></>
              )}
            </Box>


            {/* BOTTOM PART  */}
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              my={6}
            >
              <Input
                mr={'10px'}
                height={'66px'}
                bgColor={'#f3f7fc'}
                border={'none'}
                placeholder='Type Your Message...'
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={newMessage !== "" ? sendMessage : null}
              />
              <Button
                bg='buttonPrimaryColor'
                size='lg'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={newMessage !== "" ? sendMessage : null}>
                <FiSend />
              </Button>
            </Box>
          </>)
          :
          (<Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
            flexDirection={'column'}
            initial="hidden"
            animate="visible"
            variants={variants}
          >
            <Image src='./images/groupchat.jpg' />
            <Text fontSize={'5xl'} color={'buttonPrimaryColor'}>
              Open a Conversation to Start a Chat
            </Text>
            <Text color={'greyTextColor'}>
            Select or create a group to have conversation, share video and start connecting with other users.
            </Text>
          </Box>)
      }
    </Box>
  )
}

export default Chatbox