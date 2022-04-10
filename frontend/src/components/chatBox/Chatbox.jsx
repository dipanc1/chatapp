import axios from 'axios'
import React from 'react'
import { io } from 'socket.io-client'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import Message from '../message/Message'
import "./chatbox.scss"

const Chatbox = () => {
  const { currentChat } = React.useContext(PhoneNumberContext)
  const user = JSON.parse(localStorage.getItem('user'));
  // console.log(currentChat);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [arrivalMessage, setArrivalMessage] = React.useState(null);
  const socket = React.useRef();
  const scrollRef = React.useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      text: newMessage,
      sender: user._id,
      conversationId: currentChat._id
    };

    const receiverId = currentChat.members.find(member => member !== user._id);

    socket.current.emit('sendMessage',
      {
        senderId: user._id,
        receiverId,
        text: newMessage
      });

    try {
      const res = await axios.post(`http://localhost:8000/message`, message)
      setMessages([...messages, res.data])
      console.log(res);
      setNewMessage('')
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/message/${currentChat?._id}`)
        console.log(res);
        setMessages(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    getMessages();
  }, [currentChat?._id]);

  // console.log(messages);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  React.useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages(prev=>[...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat?.members]);

  // React.useEffect(() => {
  //   socket.current = io('ws://localhost:8900');
  //   socket.current.on('getMessage', (data) => {
  //     setArrivalMessage({
  //       sender: data.senderId,
  //       text: data.text,
  //       createdAt: Date.now()
  //     });
  //   });
  // }, []);

  // React.useEffect(() => {
  //   socket.current.emit('addUser', user._id);
  //   socket.current.on('getUsers', users => {
  //     console.log(users);
  //   });
  // }, [socket, user._id]);


  return (
    <div className='chatbox'>
      {
        currentChat ?
          (<>
            <div className="top">
              <div className="chatbox-group-name">
                <h5>
                  <img src="https://via.placeholder.com/150" alt="group-icon" className='group-icon-chat' />
                  John Doe</h5>
                <p>4 members</p>
              </div>
            </div>
            <hr style={{
              marginBottom: '15px'
            }} />
            <div className="middle">
              {messages.map((m) => (
                <div ref={scrollRef}>
                  <Message key={m._id} message={m} own={m.sender === user._id} />
                </div>
              ))}
            </div>
            <div className="chatBottom">
              <textarea name="message" id="message" placeholder='Type Your Message...'
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
              <button className='chatSubmit' onClick={newMessage !== "" ? handleSubmit : null}>→</button>
            </div>
          </>) : (<span className='noConvo'>Open a conversation to start a chat.</span>)
      }
    </div>
  )
}

export default Chatbox