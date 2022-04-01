import React from 'react'
import Message from '../message/Message'
import "./chatbox.scss"

const Chatbox = () => {
  const {user} = React.useContext()
  return (
    <div className='chatbox'>
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
        <Message own={false}/>
        <Message own={true}/>
        <Message own={false}/>
        <Message own={true}/>
      </div>
      <div className="chatBottom">
          <textarea name="message" id="message" placeholder='Type Your Message...' />
          <button className='chatSubmit'>→</button>
      </div>
    </div>
  )
}

export default Chatbox