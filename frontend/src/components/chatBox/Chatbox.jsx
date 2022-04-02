import React from 'react'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import Message from '../message/Message'
import "./chatbox.scss"

const Chatbox = () => {
  const {currentChat} = React.useContext(PhoneNumberContext)
  const [messages, setMessages] = React.useState([]);

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
              <Message own={true} />
              <Message own={false} />
              <Message own={true} />
              <Message own={false} />
              <Message own={true} />
            </div>
            <div className="chatBottom">
              <textarea name="message" id="message" placeholder='Type Your Message...' />
              <button className='chatSubmit'>→</button>
            </div>
          </>) : (<span className='noConvo'>Open a conversation to start a chat.</span>)
      }
    </div>
  )
}

export default Chatbox