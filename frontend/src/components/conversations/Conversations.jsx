import React from 'react'
import "./conversations.scss"

const Conversations = () => {
    return (
        <div className='conversations'>
            <input
                type="text"
                id="search"
                name='search'
                placeholder='Search'
            />
            <div className="conversations-list">
                <div className="conversation-title">
                    <h5>Conversations</h5>
                    <p>\/</p>
                </div>
                <div className="conversation-avatar-name">
                    <img src="https://via.placeholder.com/150" alt="avatar" className='avatar'/>
                    <p className='name'>John Doe</p>
                </div>
                <div className="conversation-avatar-name">
                    <img src="https://via.placeholder.com/50" alt="avatar" className='avatar'/>
                    <p className='name'>John Doe</p>
                </div>
                <div className="conversation-avatar-name">
                    <img src="https://via.placeholder.com/150" alt="avatar" className='avatar'/>
                    <p className='name'>John Doe</p>
                </div>
                <div className="conversation-avatar-name">
                    <img src="https://via.placeholder.com/150" alt="avatar" className='avatar'/>
                    <p className='name'>John Doe</p>
                </div>
                <div className="conversation-avatar-name">
                    <img src="https://via.placeholder.com/150" alt="avatar" className='avatar'/>
                    <p className='name'>John Doe</p>
                </div>
            </div>
            <div className="groups-list">
                <div className="group-title">
                    <h5>Groups</h5>
                    <p>\/</p>
                </div>
                <div className="group-icon-name">
                    <img src="https://via.placeholder.com/150" alt="icon" className='icon'/>
                    <p className='name'>John Doe</p>
                </div>
                <div className="group-icon-name">
                    <img src="https://via.placeholder.com/150" alt="icon" className='icon'/>
                    <p className='name'>John Doe</p>
                </div>
                <div className="group-icon-name">
                    <img src="https://via.placeholder.com/150" alt="icon" className='icon'/>
                    <p className='name'>John Doe</p>
                </div>
                <div className="group-icon-name">
                    <img src="https://via.placeholder.com/150" alt="icon" className='icon'/>
                    <p className='name'>John Doe</p>
                </div>
                <div className="group-icon-name">
                    <img src="https://via.placeholder.com/150" alt="icon" className='icon'/>
                    <p className='name'>John Doe</p>
                </div>
            </div>
        </div>
    )
}

export default Conversations