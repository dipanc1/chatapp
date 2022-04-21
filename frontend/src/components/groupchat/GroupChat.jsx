import './groupChat.scss'

const GroupChat = ({chat}) => {
    return (
        <div className="group-name">
            {/* <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />  */}
            {/* will add image later */}
            
            <p>{chat.chatName}</p>
        </div>
    )
}

export default GroupChat