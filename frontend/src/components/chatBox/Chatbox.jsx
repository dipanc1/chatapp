import axios from 'axios'
import React from 'react'
import { io } from 'socket.io-client'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import Message from '../message/Message'
import "./chatbox.scss"
import Loading from '../Loading'

const ENDPOINT = 'http://localhost:8000';
var socket, selectedChatCompare;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = React.useContext(PhoneNumberContext);
  console.log(selectedChat);
  const [profile, setProfile] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState();
  const [socketConnected, setSocketConnected] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef();
  const user = JSON.parse(localStorage.getItem('user'));

  React.useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
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
      console.log(data);
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

    setProfile(selectedChat?.users.find(member => member._id !== user._id));

    fetchMessages();

    selectedChatCompare = selectedChat;

  }, [selectedChat])

  React.useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // notification 
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
        console.log(data);
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
              <div className="chatbox-group-name">
                <h5>
                  {selectedChat?.isGroupChat ?
                    null :
                    <img src={profile?.pic} alt="group-icon" className='group-icon-chat' />
                  }
                  {selectedChat?.isGroupChat ? selectedChat?.chatName.toUpperCase() : profile?.username}
                </h5>
                <p>{
                  selectedChat?.isGroupChat ?
                    `${selectedChat?.users.length} members` :
                    null
                }</p>
              </div>
            </div>
            <hr style={{
              marginBottom: '15px'
            }} />


            <div className="middle">

              {loading ? (
                <div className="loading">
                  <Loading />
                </div>
              ) : (
                messages?.map((m) => (
                  <div ref={scrollRef}>
                    <Message key={m._id} messages={m} own={m.sender._id === user._id} />
                  </div>
                ))
              )}
            </div>

            {isTyping ? (
                <div>
                 typing
                </div>
              ) : (
                <></>)}

            <div className="chatBottom">
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