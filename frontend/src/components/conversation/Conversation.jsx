import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import './conversation.scss'

const Conversation = ({chat}) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [loggedUser, setLoggedUser] = useState();
    const selectedChat = useContext(PhoneNumberContext);
    const { dispatch } = useContext(PhoneNumberContext);
    const [friends, setFriends] = useState([]);

    useEffect(() => {

        // console.log(chat.map(friend => friend.isGroupChat ? null : friend.users.find(member => member._id !== user._id)));
        setFriends((chat.map(friend => friend.isGroupChat ? null : friend.users.find(member => member._id !== user._id))).filter(friend => friend !== null).map(friend => friend));
        console.log((chat.map(friend => friend.isGroupChat ? null : friend.users.find(member => member._id !== user._id))).filter(friend => friend !== null).map(friend => friend));
    }, [chat, user._id])

    return (
        <div className='conversation'>
            <img src={friends && friends.pic} alt="avatar" className='conversationImg' />
            <span className='conversationName'>{friends && friends?.username}</span>
        </div>
    )
}

export default Conversation