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
                    <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' />
                </div>
                <hr style={{ 'color': "#f3f7fc" }} />
                <div className="conversation-avatar-name">
                    <div className="name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='avatar' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot">
                        <p className="dotN">
                            2
                        </p>
                    </span>
                </div>
                <div className="conversation-avatar-name disabled">
                    <div className="name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='avatar' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot disabled"></span>
                </div>
                <div className="conversation-avatar-name disabled">
                    <div className="name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='avatar' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot disabled"></span>
                </div>
                <div className="conversation-avatar-name disabled">
                    <div className="name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='avatar' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot disabled"></span>
                </div>
                <div className="conversation-avatar-name disabled">
                    <div className="name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='avatar' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot disabled"></span>
                </div>
            </div>
            <div className="groups-list">
                <div className="group-title">
                    <h5>Groups</h5>
                    <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' />
                </div>
                <hr style={{ 'color': "#f3f7fc" }} />
                <div className="group-icon-name disabled">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group disabled"></span>
                </div>
                <div className="group-icon-name disabled">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group disabled"></span>
                </div>
                <div className="group-icon-name disabled">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group disabled"></span>
                </div>
                <div className="group-icon-name">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group">
                        <div className="dot-groupN">
                            9
                        </div>
                    </span>
                </div>
                <div className="group-icon-name disabled">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group disabled"></span>
                </div>
            </div>
        </div>
    )
}

export default Conversations