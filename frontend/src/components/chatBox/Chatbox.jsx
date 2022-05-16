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
  const [calling, setCalling] = React.useState(false);
  const [isCalling, setIsCalling] = React.useState(false);
  const [videocall, setVideocall] = React.useState(true);
  const [online, setOnline] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(false);
  const [streaming, setStreaming] = React.useState(false);
  const [fullScreenMode, setFullScreenMode] = React.useState(false);
  const scrollRef = React.useRef();
  // console.warn(isTyping)

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

    socket.on("calling", () => setIsCalling(true));
    socket.on("stop calling", () => setIsCalling(false));

    // need another approach to check if the selected chat is changed
    socket.on('online', () => setIsOnline(true));
    socket.on('not online', () => setIsOnline(false));
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
    <div className={mobile ? 'chatbox' : 'chatboxMobile'}>
      {
        selectedChat ?
          (<>
            {/* TOP PART  */}
            <motion.div
              className="top"
              initial="hidden"
              animate="visible"
              variants={variants}
            >
              <motion.div
                className="chatbox-group-name"
                initial="hidden"
                animate="visible"
                variants={variants}
                style={{ margin: selectedChat?.isGroupChat ? '8px' : null }}>
                {selectedChat?.isGroupChat ?
                  null :
                  <motion.img
                    src={profile?.pic}
                    alt="group-icon"
                    className='group-icon-chat'
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                  />
                }
                {
                  streaming ?
                    null :
                    <>
                      <motion.span
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                      >
                        {selectedChat?.isGroupChat ? selectedChat?.chatName.toUpperCase() : profile?.username}
                      </motion.span>
                      <motion.span
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        className='chatbox-group-members'
                      >{
                          selectedChat?.isGroupChat ?
                            `${selectedChat?.users.length} members` :
                            null
                        }</motion.span>
                    </>
                }
              </motion.div>
              {selectedChat?.isGroupChat ?
                <div className="chatbox-streaming">
                  <Stream streaming={streaming} setStreaming={setStreaming} fullScreenMode={fullScreenMode} setFullScreenMode={setFullScreenMode} calling={calling} setCalling={setCalling} isCalling={isCalling} setIsCalling={setIsCalling} socket={socket} videocall={videocall} setVideocall={setVideocall} />
                </div>
                :
                <div className="chatbox-online-status">
                  {isOnline ?
                    <img src='https://img.icons8.com/emoji/48/000000/green-circle-emoji.png' alt="online-icon" className='online-icon-chat' /> :
                    <img src='https://img.icons8.com/emoji/48/000000/red-circle-emoji.png' alt="offline-icon" className='offline-icon-chat' />
                  }
                </div>
              }
              <div className="chatboxGroupModal">
                <DetailsModal />
              </div>
            </motion.div>
            <hr style={{
              marginBottom: '15px'
            }} />


            {/* MIDDLE PART  */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={variants}
              className={streaming && selectedChat.isGroupChat ? "middleStream" : fullScreenMode ? 'middle' : 'middle'}
            >

              {loading ?
                (
                  <div className="loading">
                    <Loading />
                  </div>
                ) :
                (messages?.map((m, i) => (
                  <motion.div
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
                  </motion.div>
                )))
              }
              {isTyping ? (
                <div className='typing'>
                  <Lottie
                    loop={true}
                    style={{
                      width: '7vw',
                    }}
                    animationData={animationData}
                  />
                </div>
              ) : (
                <></>
              )}
            </motion.div>


            {/* BOTTOM PART  */}
            <div className={fullScreenMode ? 'chatBottom' : streaming ? "chatBottomStream" : 'chatBottom'}>
              <input name="message" id="message" placeholder='Type Your Message...'
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={newMessage !== "" ? sendMessage : null}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='chatSubmit' onClick={newMessage !== "" ? sendMessage : null}>→</motion.button>
            </div>
          </>)
          :
          (<motion.span
            className='noConvo'
            initial="hidden"
            animate="visible"
            variants={variants}
          >Open a conversation to start a chat.</motion.span>)
      }
    </div>
  )
}

export default Chatbox