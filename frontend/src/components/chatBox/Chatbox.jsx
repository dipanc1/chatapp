import axios from 'axios'
import React from 'react'
import { io } from 'socket.io-client'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import Message from '../message/Message'
import UpdateGroupChatModal from '../UpdateGroupChatModal/UpdateGroupChatModal'
import "./chatbox.scss"

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = React.useContext(PhoneNumberContext);
  console.log(selectedChat)
  const user = JSON.parse(localStorage.getItem('user'));
  ;


  return (
    <div className='chatbox'>
      {
        selectedChat ?
          (<>
            <div className="top">
              <div className="chatbox-group-name">
                <h5>
                  {selectedChat.isGroupChat ?
                    null :
                    <img src={selectedChat.pic} alt="group-icon" className='group-icon-chat' />
                  }
                  {selectedChat.isGroupChat ? selectedChat.chatName.toUpperCase() : selectedChat.username}
                </h5>
                <p>{
                  selectedChat.isGroupChat ?
                    `${selectedChat.users.length} members` :
                    null
                }</p>
              </div>
              {/* {selectedChat.isGroupChat &&
              <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />} */}
            </div>
            <hr style={{
              marginBottom: '15px'
            }} />
            <div className="middle">
              {/* {messages.map((m) => (
                <div ref={scrollRef}>
                  <Message key={m._id} message={m} own={m.sender === user._id} />
                </div>
              ))} */}
            </div>
            <div className="chatBottom">
              {/* <textarea name="message" id="message" placeholder='Type Your Message...'
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
              <button className='chatSubmit' onClick={newMessage !== "" ? handleSubmit : null}>→</button> */}
            </div>
          </>) : (<span className='noConvo'>Open a conversation to start a chat.</span>)
      }
    </div>
  )
}

export default Chatbox