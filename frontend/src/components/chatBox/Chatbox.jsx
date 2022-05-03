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

const ENDPOINT = 'http://localhost:8000';
var socket, selectedChatCompare;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { selectedChat, notification, dispatch } = React.useContext(PhoneNumberContext);
  const [online, setOnline] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState();
  const [socketConnected, setSocketConnected] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [streaming, setStreaming] = React.useState(false);
  const [callactive, setCallactive] = React.useState(false);
  const [fullScreenMode, setFullScreenMode] = React.useState(true);
  // console.warn(fullScreenMode);

  const scrollRef = React.useRef();

  React.useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on('call', (data) => {
      console.warn(data.call);
      setCallactive(data.call);
    });
    // need another approach to check if the selected chat is changed
    socket.on('user online', (userData) => {
      if (userData._id === (selectedChat?.users.filter(u => u._id !== user._id)[0]._id)) {
        setOnline(true);
      } else {
        setOnline(false);
      }
    });
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
      const { data } = await axios.get(`http://localhost:8000/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  }

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

    selectedChatCompare = selectedChat;

  }, [selectedChat])

  React.useEffect(() => {
    socket.emit('user online', user.username);
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
        const { data } = await axios.post(`http://localhost:8000/message`, {
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

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var typingTimer = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeElapsed = timeNow - lastTypingTime;
      if (timeElapsed >= typingTimer && typing) {
        setTyping(false);
        socket.emit("stop typing", selectedChat._id);
      }
    }, typingTimer);
  }


  return (
    <div className='chatbox'>
      {
        selectedChat ?
          (<>
            <div className="top">
              <div className="chatbox-group-name" style={{ margin: selectedChat?.isGroupChat ? '8px' : null }}>
                {selectedChat?.isGroupChat ?
                  null :
                  <img src={profile?.pic} alt="group-icon" className='group-icon-chat' />
                }
                {
                  streaming ?
                    null :
                    <>
                      <span>
                        {selectedChat?.isGroupChat ? selectedChat?.chatName.toUpperCase() : profile?.username}
                      </span>
                      <span className='chatbox-group-members'>{
                        selectedChat?.isGroupChat ?
                          `${selectedChat?.users.length} members` :
                          null
                      }</span>
                    </>
                }
              </div>
              {selectedChat?.isGroupChat ?
                <div className="chatbox-streaming">
                  <Stream streaming={streaming} setStreaming={setStreaming} fullScreenMode={fullScreenMode} setFullScreenMode={setFullScreenMode} callactive={callactive} setCallactive={setCallactive} socket={socket}/>
                </div>
                :
                <div className="chatbox-online-status">
                  {online ?
                    <img src='https://img.icons8.com/emoji/48/000000/green-circle-emoji.png' alt="online-icon" className='online-icon-chat' /> :
                    <img src='https://img.icons8.com/emoji/48/000000/red-circle-emoji.png' alt="offline-icon" className='offline-icon-chat' />
                  }
                </div>
              }
              <div className="chatboxGroupModal">
                <DetailsModal />
              </div>
            </div>
            <hr style={{
              marginBottom: '15px'
            }} />


            <div className={streaming && selectedChat.isGroupChat ? "middleStream" : !fullScreenMode ? 'middle' : 'middle'}>

              {loading ? (
                <div className="loading">
                  <Loading />
                </div>
              ) : (
                messages?.map((m, i) => (
                  <div key={m._id} ref={scrollRef}>
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
                  </div>
                ))
              )}
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
                <></>)}
            </div>


            <div className={streaming ? "chatBottomStream" : !fullScreenMode ? 'chatBottom' : 'chatBottom'}>
              <input name="message" id="message" placeholder='Type Your Message...'
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={newMessage !== "" ? sendMessage : null}
              />
              <button className='chatSubmit' onClick={newMessage !== "" ? sendMessage : null}>→</button>
            </div>
          </>) : (<span className='noConvo'>Open a conversation to start a chat.</span>)
      }
    </div>
  )
}

export default Chatbox