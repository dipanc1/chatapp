import axios from 'axios'
import React from 'react'
import { AppContext } from '../../context/AppContext'
import { SocketContext } from '../../context/SocketContext'
import Message from '../Miscellaneous/Message'
import Lottie from "lottie-react";
import animationData from '../../animations/typing.json'
import DetailsModal from '../UserModals/DetailsModal'
import { format } from 'timeago.js'
import { HiUserRemove } from 'react-icons/hi'
import EndLeaveModal from '../UserModals/EndLeaveModal'
import { backend_url } from '../../baseApi'
import { Modal, ModalBody, ModalCloseButton, ModalContent, useDisclosure, ModalFooter, ModalHeader, ModalOverlay, Avatar, AvatarBadge, Box, Button, Divider, Flex, Image, Img, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'
import InfiniteScroll from 'react-infinite-scroll-component'
import StreamModalPeer from '../UserModals/StreamModalPeer'
import { useLocation } from 'react-router-dom'

var selectedChatCompare;

export const ChatBoxComponent = ({ setToggleChat, stream, flex, height, selectedChat, fetchAgain, setFetchAgain, user, toast }) => {
  const socket = React.useContext(SocketContext);
  const { notification, dispatch } = React.useContext(AppContext);

  const [messages, setMessages] = React.useState([]);
  const [page, setPage] = React.useState(2);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState("");
  const [socketConnected, setSocketConnected] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  const location = useLocation();

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

    setPage(2);

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
      const { data } = await axios.get(`${backend_url}/message/${selectedChat._id}/1`, config);
      // console.log("Data fetch 1", data);
      setMessages(data.messages);
      setHasMore(data.hasMore);
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

  const fetchMoreMessages = async () => {
    if (!selectedChat) return;
    setPage(page + 1);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`${backend_url}/message/${selectedChat._id}/${page}`, config);
      setMessages([...messages, ...data.messages]);
      setHasMore(data.hasMore);
      // console.log("Fetch more", page, data);
    } catch (error) {
      // console.log(error);
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
        socket.emit("new message", data.message);
        setMessages([data.message, ...messages]);
        // console.log(data, messages);
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
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id || location.pathname !== '/video-chat') {
        if (!notification.includes(newMessageReceived)) {
          if (notification.length >= 5) {
            notification.pop();
          }

          dispatch({ type: 'SET_NOTIFICATION', payload: [newMessageReceived, ...notification] });
          // console.log(newMessageReceived);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([newMessageReceived, ...messages]);
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

  return (
    <>
      {stream && (
        <>
        <Box onClick={() => setToggleChat(false)} p='10px' background='#f0ecfb' display={['flex', 'none']} justifyContent='space-between' alignItems='center'>
            <Text>Messages</Text>
            <Image src="https://ik.imagekit.io/sahildhingra/down-arrow.png" h='20px' />
        </Box>
        </>
      )}
      {/* MIDDLE PART  */}
      {loading ?
        (
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flex={flex} height={height}>
            <Spinner
              thickness='4px'
              speed='0.2s'
              emptyColor='gray.200'
              color='buttonPrimaryColor'
              size='xl'
            />
          </Box>
        )
        :
        (
          <div
            id="scrollableDiv"
            style={{
              flex: flex,
              height: height,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          >
            {/*Put the scroll bar always on the bottom*/}
            <InfiniteScroll
              dataLength={messages.length}
              next={fetchMoreMessages}
              style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
              inverse={true} //
              hasMore={hasMore}
              loader={
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mt={44}>
                  <Spinner
                    thickness='4px'
                    speed='0.2s'
                    emptyColor='gray.200'
                    color='buttonPrimaryColor'
                    size='xl'
                  />
                </Box>}
              scrollableTarget="scrollableDiv"
            >
              {messages?.map((m, i) => (
                <Box
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  key={m._id}
                >
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
              ))}
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
            </InfiniteScroll>
          </div>
        )}

      {/* BOTTOM PART  */}
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        background="#F6F3FF"
        padding="15px 30px"
      >
        <Input
          mr={'10px'}
          bgColor={'#fff'}
          border={'none'}
          placeholder='Type Your Message...'
          focusBorderColor='#9F85F7'
          onChange={typingHandler}
          value={newMessage}
          onKeyDownCapture={newMessage !== "" ? sendMessage : null}
        />
        <Button
          bg='buttonPrimaryColor'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={newMessage !== "" ? sendMessage : null}>
          <FiSend color="#fff" />
        </Button>
      </Box>
    </>
  )
}

const Chatbox = ({ fetchAgain, setFetchAgain, getMeetingAndToken, meetingId }) => {
  const { dispatch, fullScreen } = React.useContext(AppContext);
  const [groupChatName, setGroupChatName] = React.useState('');
  const [renameLoading, setRenameLoading] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = JSON.parse(localStorage.getItem('user'));
  const cancelRef = React.useRef()
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()
  const [online, setOnline] = React.useState(false);
  const [profile, setProfile] = React.useState(null);

  const { selectedChat } = React.useContext(AppContext);

  const toast = useToast();
  const [loading, setLoading] = React.useState(false)
  const admin = selectedChat?.isGroupChat && selectedChat?.groupAdmin._id === user._id;

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      return toast({
        title: "Error Occured!",
        description: "You are not the admin of this group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${backend_url}/conversation/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? dispatch({ type: 'SET_SELECTED_CHAT', payload: '' }) : dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        title: "Success!",
        description: "You left the group",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to leave the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

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
      toast({
        title: "Group chat renamed",
        description: "Group chat renamed to " + groupChatName,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
      setGroupChatName('');
      setFetchAgain(!fetchAgain);
      dispatch({ type: 'SET_SELECTED_CHAT', payload: null })
      onClose();
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Rename Group Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
    }
  }

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
      toast({
        title: "Error Occured!",
        description: "Failed to Check Online Status",
        status: "error",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
    }
  }


  React.useEffect(() => {
    if (!selectedChat) {
      return;
    }
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
      height={'100%'}
      bg={'whiteColor'}
      my={'5'}
      m='0'
      borderLeft='1px solid #EAE4FF'
      display='flex'
      flexDirection='column'
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
              px={4}
              py="17px"
              initial="hidden"
              animate="visible"
              variants={variants}
              background="#F6F3FF"
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
                <Box
                  display={['block', 'none']}
                  pe='10px'
                  onClick={() => {
                    dispatch({ type: "SET_SELECTED_CHAT", payload: null });
                  }}
                >
                  <Image h='18px' src="https://ik.imagekit.io/sahildhingra/back.png" />
                </Box>
                {selectedChat?.isGroupChat ?
                  null :
                  <Avatar
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    height='46px'
                    width='46px'
                    name={profile?.username}
                    src={profile?.pic}
                    mr={4}
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
                  fontSize='16px'
                  fontWeight={'bold'}
                >
                  {selectedChat?.isGroupChat ? selectedChat?.chatName.toUpperCase() : profile?.username}
                </Text>
              </Box>
              <Box display='flex' alignItems='center'>
                {
                  selectedChat && (
                    selectedChat?.isGroupChat && (
                      <Button
                        background="transparent"
                        borderRadius="100%"
                        ms="15px"
                        h='40px'
                        w='40px'
                        p='0'
                        onClick={onOpen}
                      >
                        <Img
                          h='22px'
                          src="https://ik.imagekit.io/sahildhingra/settings.png" alt="" />
                      </Button>
                    )
                  )
                }

              </Box>
              <Flex
                display={['block', 'none', 'none', 'none']}
              >
                <DetailsModal />
              </Flex>

            </Box>

            <Divider orientation='horizontal' />
            <ChatBoxComponent flex='1' height={'78%'} setOnline={setOnline} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} user={user} toast={toast} selectedChat={selectedChat} meetingId={meetingId} />

            {/* Group Settings Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Settings</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                  <hr />
                  {renameLoading ?
                    <Box display={'flex'}
                      alignItems={'center'}
                      justifyContent={'center'}
                      my={2}>
                      <Spinner
                        thickness='4px'
                        speed='0.7s'
                        emptyColor='gray.200'
                        color='buttonPrimaryColor'
                        size='md'
                      />
                    </Box>
                    :
                    <Box display={'flex'} flexDirection={'column'} mt="30px" mb={fullScreen ? '50px' : '2'}>
                      <Input
                        mr={'2'}
                        value={groupChatName}
                        placeholder={selectedChat?.chatName}
                        _placeholder={{ color: 'inherit' }}
                        onChange={(e) => setGroupChatName(e.target.value)}
                      />
                    </Box>
                  }
                </ModalBody>

                <ModalFooter justifyContent='space-between'>
                  <Box my={fullScreen ? '2' : '0'}>
                    <Button size={fullScreen ? 'md' : 'sm'} onClick={onConfirmOpen} rightIcon={<HiUserRemove />} colorScheme='red' variant='outline'>
                      Leave Group
                    </Button>
                  </Box>
                  <button className='btn btn-primary' onClick={handleRename}>
                    Update
                  </button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <EndLeaveModal
              leastDestructiveRef={cancelRef}
              onClose={onConfirmClose}
              header={'Leave Group'}
              body={'Are you sure you want to leave this group?'}
              confirmButton={'Leave'}
              confirmFunction={() => {
                handleRemove(user);
                onConfirmClose();
              }}
              isOpen={isConfirmOpen}
            />

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
            <Image src='./images/chatmain.png' h='150px' mb='10px' />
            <Text fontSize={['xl', 'xl', 'xl', '2xl']} color={'buttonPrimaryColor'}>
              Open a Conversation to Start a Chat
            </Text>
            <Text fontSize={['xs', 'md', 'md', 'md']} px='50px' textAlign='center' pt='20px' color={'greyTextColor'}>
              Select or create a group to have conversation, share video and start connecting with other users.
            </Text>
          </Box>)
      }
    </Box>
  )
}

export default Chatbox