import './chatOnline.scss'

const ChatOnline = ({user}) => {
    return (
        <div className='chatOnline'>
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img src={user.pic} alt="avatar" className="chatOnlineImg" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <div className="chatOnlineName">
                    <span>{user.username}</span>
                </div>
            </div>
        </div>
    )
}

export default ChatOnline