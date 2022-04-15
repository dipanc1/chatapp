import './chatOnline.scss'

const ChatOnline = ({ user1, handleFunction }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className='chatOnline'>
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img src={user1.pic} alt="avatar" className="chatOnlineImg" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <div className="chatOnlineName">
                    <span>{user1.username}</span>
                   {user._id === user1._id  ? null : <span className='chatOnlineCross' onClick={handleFunction}>X</span> }
                </div>
            </div>
        </div>
    )
}

export default ChatOnline