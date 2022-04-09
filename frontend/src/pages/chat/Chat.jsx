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
      {user && <Navbar />}
      <div className='chat'>
        <div className="left">
          {user && <Conversations />}
        </div>
        <div className="middle">
          {user && <Chatbox />}
        </div>
        <div className="right">
          {user && <Members />}
        </div>
      </div>
    </>
  )
}

export default Chat