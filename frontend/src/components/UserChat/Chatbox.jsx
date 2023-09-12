import axios from 'axios'
import React from 'react'
import { AppContext } from '../../context/AppContext'
import { SocketContext } from '../../context/SocketContext'
import Message from '../Miscellaneous/Message'
import Lottie from "lottie-react";
import animationData from '../../animations/typing.json'
import DetailsModal from '../UserModals/DetailsModal'
import { format } from 'timeago.js'
import EndLeaveModal from '../UserModals/EndLeaveModal'
import { api_key, backend_url, folder, pictureUpload } from '../../utils'
import { Avatar, AvatarBadge, Box, Button, Divider, Flex, Image, Img, Input, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { FiImage, FiPaperclip, FiSend } from 'react-icons/fi'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import GroupSettingsModal from '../UserModals/GroupSettingsModal'
import { BsFilePdf } from 'react-icons/bs'
import ImageAttachmentModal from '../UserModals/ImageAttachmentModal'
import DocumentAttachmentModal from '../UserModals/DocumentAttachmentModal'

var selectedChatCompare;

export const ChatBoxComponent = ({ setToggleChat, stream, flex, height, selectedChat, fetchAgain, setFetchAgain, user, toast }) => {
  const socket = React.useContext(SocketContext);
  const { notification, dispatch, userInfo, signature, timestamp } = React.useContext(AppContext);

  const [messages, setMessages] = React.useState([]);
  const [page, setPage] = React.useState(2);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState("");
  const [socketConnected, setSocketConnected] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = React.useState(false);
  const [loadingWhileSendingImage, setLoadingWhileSendingImage] = React.useState(false);

  const { isOpen: isOpenImageAttachment, onOpen: onOpenImageAttachment, onClose: onCloseImageAttachment } = useDisclosure()
  const { isOpen: isOpenDocumentAttachment, onOpen: onOpenDocumentAttachment, onClose: onCloseDocumentAttachment } = useDisclosure()

  const [selectedImage, setSelectedImage] = React.useState(null);

  const location = useLocation();

  const scrollRef = React.useRef();

  React.useEffect(() => {
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.emit("user-online", userInfo);

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.off("user-online");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });

    var element = document.getElementById("scrollableDiv");
    if (!element) return;
    element.scrollTop = element?.scrollHeight;
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

  const sendMessage = async (event, imageUrl) => {
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
          content: imageUrl !== null ? imageUrl : newMessage,
          chatId: selectedChat._id
        }, config);
        socket.emit("new message", data.message);
        setMessages([data.message, ...messages]);
        setLoadingWhileSendingImage(false);
      } catch (error) {
        // console.log(error);
        setLoadingWhileSendingImage(false);
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
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([newMessageReceived, ...messages]);
      }
    })

    return () => socket.off("message received");
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

  const uploadImageAndSend = async (e) => {
    setLoadingWhileSendingImage(true);
    if (selectedImage !== null && selectedImage !== undefined && (selectedImage.type === 'image/jpeg' || selectedImage.type === 'image/png')) {
      const formData = new FormData();
      formData.append('api_key', api_key)
      formData.append('file', selectedImage);
      // TODO: change folder name for each user
      formData.append('folder', folder)
      formData.append('timestamp', timestamp)
      formData.append('signature', signature)

      await axios.post(pictureUpload, formData)
        .then(async res => {
          setSelectedImage(null);
          onCloseImageAttachment();
          setShowAttachmentOptions(false);
          sendMessage(e, res.data.secure_url);
        })
        .catch(err => console.log(err), setLoadingWhileSendingImage(false))
    }
  }

  const uploadFileAndSend = async (e) => {
    if (selectedImage !== null && selectedImage !== undefined && (selectedImage.type === 'image/jpeg' || selectedImage.type === 'image/png')) {
      const formData = new FormData();
      formData.append('api_key', api_key)
      formData.append('file', selectedImage);
      // TODO: change folder name for each user
      formData.append('folder', folder)
      formData.append('timestamp', timestamp)
      formData.append('signature', signature)

      await axios.post(pictureUpload, formData)
        .then(async res => {
          setSelectedImage(null);
          onCloseImageAttachment();
          setShowAttachmentOptions(false);
          sendMessage(e, res.data.secure_url);
        })
        .catch(err => console.log(err))
    }
  }



  return (
    <>
      {stream && (
        <>
          <Box onClick={() => setToggleChat(false)} p='10px' background='#f0ecfb' display={['flex', 'flex', 'none']} justifyContent='space-between' alignItems='center'>
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
            id="scrollableDivChat"
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
              style={{ display: 'flex', flexDirection: 'column-reverse' }} // To put endMessage and loader to the top.
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
              scrollableTarget="scrollableDivChat"
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
                    own={m.sender._id === userInfo._id}
                    sameSender={(i < messages.length - 1 &&
                      (messages[i + 1].sender._id !== m.sender._id ||
                        messages[i + 1].sender._id === undefined) &&
                      messages[i].sender._id !== userInfo._id) || (i === messages.length - 1 &&
                        messages[messages.length - 1].sender._id !== userInfo._id &&
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
        padding="15px 10px"
      >
        <Box position='relative'>
          {
            showAttachmentOptions && (
              <Flex boxShadow='2xl' left='-10px' p='10px' borderRadius='35px' background='#fff' flexDirection='column' gap='10px' position='absolute' bottom='calc(100% + 20px)'>
                <Button
                  onClick={onOpenImageAttachment}
                  borderRadius='100%'>
                  <FiImage />
                </Button>
                <Button
                  onClick={onOpenDocumentAttachment}
                  borderRadius='100%'>
                  <BsFilePdf />
                </Button>
              </Flex>
            )
          }
          <Button
            onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
            borderRadius='100%'>
            <FiPaperclip />
          </Button>
        </Box>
        <Input
          mx={'10px'}
          bgColor={'#fff'}
          border={'none'}
          placeholder='Type Your Message...'
          focusBorderColor='#9F85F7'
          onChange={typingHandler}
          value={newMessage}
          onKeyDownCapture={newMessage !== "" ? e => sendMessage(e, null) : null}
        />
        <Button
          bg='buttonPrimaryColor'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={newMessage !== "" ? e => sendMessage(e, null) : null}>
          <FiSend color="#fff" />
        </Button>
      </Box>
      <ImageAttachmentModal
        isOpenImageAttachment={isOpenImageAttachment}
        onCloseImageAttachment={onCloseImageAttachment}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        uploadImageAndSend={uploadImageAndSend}
        loadingWhileSendingImage={loadingWhileSendingImage}
      />
      <DocumentAttachmentModal
        isOpenDocumentAttachment={isOpenDocumentAttachment}
        onCloseDocumentAttachment={onCloseDocumentAttachment}
      />
    </>
  )
}

const Chatbox = ({ fetchAgain, setFetchAgain, getMeetingAndToken, meetingId }) => {
  const { dispatch, userInfo } = React.useContext(AppContext);
  const [groupChatName, setGroupChatName] = React.useState('');
  const [groupChatDescription, setGroupChatDescription] = React.useState('');
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
  const admin = selectedChat?.isGroupChat && selectedChat?.groupAdmin._id === userInfo._id;

  const handleRemove = async (user1) => {
    if (user1._id !== userInfo._id) {
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
      await axios.put(
        `${backend_url}/conversation/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      dispatch({ type: 'SET_SELECTED_CHAT', payload: null })
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
    if (groupChatName === '' || groupChatDescription === '') {
      return toast({
        title: "Error Occured!",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
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
        description: groupChatDescription,
        chatId: selectedChat._id
      }
      await axios.put(`${backend_url}/conversation/rename`, body, config)
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
      setGroupChatDescription('');
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
      setProfile(selectedChat?.users.find(member => member._id !== userInfo._id));
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
      CheckOnlineStatus(selectedChat?.users.find(member => member._id !== userInfo._id)._id);
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
                  display={['block', 'block', 'none']}
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
              <Flex>
                <Box display='flex' alignItems='center'>
                  {
                    selectedChat && (
                      selectedChat?.isGroupChat && (
                        <Button
                          background="transparent"
                          borderRadius="100%"
                          ms="15px"
                          me='10px'
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
                  display={['block', 'block', 'none', 'none']}
                >
                  <DetailsModal admin={admin} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </Flex>
              </Flex>

            </Box>

            <Divider orientation='horizontal' />
            <ChatBoxComponent flex='1' height={'78%'} setOnline={setOnline} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} user={user} toast={toast} selectedChat={selectedChat} meetingId={meetingId} />

            {/* Group Settings Modal */}
            <GroupSettingsModal
              isOpen={isOpen}
              onClose={onClose}
              chatName={selectedChat?.chatName}
              groupChatName={groupChatName}
              setGroupChatName={setGroupChatName}
              handleRename={handleRename}
              renameLoading={renameLoading}
              onConfirmOpen={onConfirmOpen}
              description={selectedChat?.description}
              groupChatDescription={groupChatDescription} setGroupChatDescription={setGroupChatDescription}
            />

            <EndLeaveModal
              leastDestructiveRef={cancelRef}
              onClose={onConfirmClose}
              header={'Leave Group'}
              body={'Are you sure you want to leave this group?'}
              confirmButton={'Leave'}
              confirmFunction={() => {
                handleRemove(userInfo);
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