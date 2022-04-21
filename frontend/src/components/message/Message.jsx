import './message.scss'
import { format } from 'timeago.js'
import { useContext } from 'react';
import { PhoneNumberContext } from '../../context/phoneNumberContext';

const Message = ({ messages, own }) => {
    const { selectedChat } = useContext(PhoneNumberContext);
    // console.log(messages);
    return (
        selectedChat?._id === messages?.chat._id ? (<div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                <img src={messages.sender.pic} alt="avatar" className='chatbox-message-avatar' />
                <p className='messageText'>{messages.content}</p>
            </div>
            <div className="messageBottom">
                {format(messages.createdAt)}
            </div>
        </div>) : null
    )
}

export default Message