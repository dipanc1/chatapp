import './message.scss'
import { format } from 'timeago.js'
import { useContext } from 'react';
import { PhoneNumberContext } from '../../context/phoneNumberContext';

const Message = ({ messages, own, sameSender, sameTime }) => {
    const { selectedChat } = useContext(PhoneNumberContext);
    // console.log(messages);
    return (
        selectedChat?._id === messages?.chat._id ? (
            <div className={own ? 'message own' : 'message'}>
                <div className="messageTop">
                    {sameSender ?
                        <img src={messages.sender.pic} alt="avatar" className='chatbox-message-avatar' /> : null}
                    <p className='messageText'>{messages.content}</p>
                </div>
                {sameTime ?
                    null
                    : <div className="messageBottom">
                        {format(messages.createdAt)}
                    </div>}
            </div>
        ) : null
    )
}

export default Message