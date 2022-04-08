import React from 'react'
import Chatbox from '../../components/chatBox/Chatbox'
import Conversations from '../../components/conversations/Conversations'
import Members from '../../components/members/Members'
import Navbar from '../../components/navbar/Navbar'
import "./chat.scss"
import { useHistory } from "react-router-dom";

const Chat = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  let history = useHistory();

  React.useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, [history, user]);

  
  return (
    <>
      <Navbar />
      <div className='chat'>
        <div className="left">
          <Conversations />
        </div>
        <div className="middle">
          <Chatbox />
        </div>
        <div className="right">
          <Members />
        </div>
      </div>
    </>
  )
}

export default Chat