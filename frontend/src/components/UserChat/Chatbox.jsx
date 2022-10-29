import axios from 'axios'
import React from 'react'
import { AppContext } from '../../context/AppContext'
import { SocketContext } from '../../context/SocketContext'
import Message from '../Miscellaneous/Message'
import Lottie from "lottie-react";
import animationData from '../../animations/typing.json'
import DetailsModal from '../UserModals/DetailsModal'
import { format } from 'timeago.js'
import StreamModal from '../UserModals/StreamModal'
import { backend_url } from '../../baseApi'
import { Avatar, AvatarBadge, Box, Button, Divider, Flex, Image, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'


var selectedChatCompare;

export const ChatBoxComponent = ({ height, selectedChat, fetchAgain, setFetchAgain, user, toast }) => {
  const socket = React.useContext(SocketContext);
  // console.log("Socket ::: >>>",socket)
  const { notification, dispatch } = React.useContext(AppContext);
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState("");
  const [socketConnected, setSocketConnected] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef();

  React.useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.emit("user-online", user);
  }, []);


  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  React.useEffect(() => {

    fetchMessages();

    selectedChatCompare = selectedChat;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])

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
      // console.log(error);
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        isClosable: true,
        position: "top",
        duration: 5000
      });
    }
  }

  const sendMessage = async (event) => {
    if (event.key === "Enter" || event.type === "click") {
      socket.emit("stop typing", selectedChat._id);
      setNewMessage('');
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        };
        const { data } = await axios.post(`${backend_url}/message`, {
          content: newMessage,
          chatId: selectedChat._id
        }, config);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        // console.log(data);
      } catch (error) {
        // console.log(error);
        toast({
          title: "Error Occured!",
          description: "Failed to Send the Message",
          status: "error",
          isClosable: true,
          position: "top",
          duration: 5000,
        });
      }
    }
  }

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
    <>
      {/* MIDDLE PART  */}
      <Box
        initial="hidden"
        animate="visible"
        variants={variants}
        height={height}
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
      >
        <Input
          mr={'10px'}
          height={'66px'}
          bgColor={'#f3f7fc'}
          border={'none'}
          placeholder='Type Your Message...'
          focusBorderColor='#9F85F7'
          onChange={typingHandler}
          value={newMessage}
          onKeyDownCapture={newMessage !== "" ? sendMessage : null}
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
    </>
  )
}

const Chatbox = ({ fetchAgain, setFetchAgain, getMeetingAndToken, meetingId }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [meetingIdExists, setMeetingIdExists] = React.useState(false);
  const [online, setOnline] = React.useState(false);
  const [profile, setProfile] = React.useState(null);

  const { selectedChat } = React.useContext(AppContext);

  const toast = useToast();

  const admin = selectedChat?.isGroupChat && selectedChat?.groupAdmin._id === user._id;

  const CheckOnlineStatus = async (friendId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${backend_url}/users/check-online/${friendId}`, config)
      // console.log("DATAAAAAAAAAAAA", data);
      setOnline(data.isOnline);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (selectedChat?.isGroupChat) {
      try {
        const checkStream = async () => {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          }
          const { data } = await axios.get(`${backend_url}/conversation/streaming/${selectedChat._id}`, config);
          if (data) {
            setMeetingIdExists(true)
          } else {
            setMeetingIdExists(false);
          }
        }
        checkStream();
      } catch (error) {
        console.log(error);
      }

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])


  React.useEffect(() => {
    try {
      setProfile(selectedChat?.users.find(member => member._id !== user._id));
    } catch (error) {
      // console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Profile",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    if (selectedChat && !selectedChat.isGroupChat) {
      CheckOnlineStatus(selectedChat?.users.find(member => member._id !== user._id)._id);
    }
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])


  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  }

  return (
    <Box
      height={'85vh'}
      bg={'whiteColor'}
      p={'1.5'}
      my={'5'}
      mx={['5', '10', '10', '10']}
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
              </Box>

              {selectedChat?.isGroupChat && (admin || meetingIdExists) &&
                <Box>
                  <StreamModal admin={admin} getMeetingAndToken={getMeetingAndToken} />
                </Box>

              }
              <Flex
                display={['block', 'none', 'none', 'none']}
              >
                <DetailsModal />
              </Flex>

            </Box>

            <Divider orientation='horizontal' />
            <ChatBoxComponent height={'78%'} setOnline={setOnline} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} user={user} toast={toast} selectedChat={selectedChat} meetingId={meetingId} />


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
            <Text fontSize={['xl', 'xl', 'xl', '5xl']} color={'buttonPrimaryColor'}>
              Open a Conversation to Start a Chat
            </Text>
            <Text fontSize={['xs', 'md', 'md', 'md']} color={'greyTextColor'}>
              Select or create a group to have conversation, share video and start connecting with other users.
            </Text>
          </Box>)
      }
    </Box>
  )
}

export default Chatbox