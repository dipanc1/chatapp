import './message.scss'
import {format} from 'timeago.js'

const Message = ({ messages, own }) => {
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                <img src={messages.sender.pic} alt="avatar" className='chatbox-message-avatar' />
                <p className='messageText'>{messages.content}</p>
            </div>
            <div className="messageBottom">
                {format(messages.createdAt)}
            </div>
        </div>
    )
}

export default Message