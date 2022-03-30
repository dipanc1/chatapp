import React from 'react'
import Chatbox from '../../components/chatBox/Chatbox'
import Conversations from '../../components/conversations/Conversations'
import Members from '../../components/members/Members'
import Navbar from '../../components/navbar/Navbar'
import "./chat.scss"

const Chat = () => {
  return (
    <>
      <Navbar />
      <div className='chat'>
        <div className="left">
          <Conversations />
        </div>
        <div className="middle">
          {/* <Chatbox /> */}
        </div>
        <div className="right">
          <Members />
        </div>
      </div>
    </>
  )
}

export default Chat