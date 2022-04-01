import './chatOnline.scss'

const ChatOnline = () => {
    return (
        <div className='chatOnline'>
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img src="https://via.placeholder.com/150" alt="avatar" className="chatOnlineImg" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <div className="chatOnlineName">
                    <span>John Doe</span>
                </div>
            </div>
        </div>
    )
}

export default ChatOnline