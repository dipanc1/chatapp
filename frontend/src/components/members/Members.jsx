import React from 'react'
import ChatOnline from '../chatOnline/ChatOnline'
import "./members.scss"

const Members = () => {
  return (
    <div className='members'>
      <div className="member-title">
        <h3>Members</h3>
        <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' />
      </div>
      <div className='members-container'>
        <hr style={{ 'color': "#f3f7fc" }} />
        <div className="member-avatar-name">
          <ChatOnline/>
        </div>
        <div className="member-avatar-name">
          <ChatOnline />
        </div>
        <div className="member-avatar-name">
          <ChatOnline/>
        </div>
        <div className="member-avatar-name">
          <ChatOnline/>
        </div>
        <div className="member-avatar-name-member">
          <div className="member-name">
            <img src="./images/add-user.png" alt="avatar" className='member-avatar' />
            <p>Add Member</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Members