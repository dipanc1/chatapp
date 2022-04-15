import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import './conversation.scss'

const Conversation = ({ chat }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    // const [loggedUser, setLoggedUser] = useState();
    // const selectedChat = useContext(PhoneNumberContext);
    // const { dispatch } = useContext(PhoneNumberContext);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // console.log(chat.users.find(member => member._id !== user._id));
        setFriends((chat.users.find(member => member._id !== user._id)))
        // console.log(friends);
    }, [chat, friends, user._id])



    return (
        <div className='conversation'>
            <img src={chat && friends.pic} alt="avatar" className='conversationImg' />
            <span className='conversationName'>{chat && friends?.username}</span>
        </div>
    )
}

export default Conversation