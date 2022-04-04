import './message.scss'
import {format} from 'timeago.js'

const Message = ({ message, own }) => {
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                <img src="https://via.placeholder.com/150" alt="avatar" className='chatbox-message-avatar' />
                <p className='messageText'>{message.text}</p>
            </div>
            <div className="messageBottom">
                {format(message.createdAt)}
            </div>
        </div>
    )
}

export default Message