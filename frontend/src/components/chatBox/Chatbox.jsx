import React from 'react'
import "./chatbox.scss"

const Chatbox = () => {
  return (
    <div className='chatbox'>
      <div className="top">
        <div className="chatbox-group-name">
          <h5>
            <img src="https://via.placeholder.com/150" alt="group-icon" className='group-icon-chat'/>
            John Doe</h5>
          <p>4 members</p>
        </div>
      </div>
      <hr />
      <div className="middle">
        <div className="chatbox-message">
            <img src="https://via.placeholder.com/150" alt="avatar" className='chatbox-message-avatar'/>
          <div className="chatbox-message-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. </p>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="chatbox-message-input">
          <input type="text" placeholder="Type a message" />
          <button>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Chatbox