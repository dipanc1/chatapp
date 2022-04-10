import axios from 'axios';
import { useEffect, useState } from 'react'
import './conversation.scss'

const Conversation = ({ conversation, currentUser }) => {

    const friendId = conversation.users._id;
    console.log(friendId)
    
    console.log(currentUser._id)
    
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const friendId = conversation.users._id;
        // const friendId = conversation.user.find(member => member !== currentUser._id);
        console.log(friendId)
        const getUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/users/find?userId=${friendId}`)
                console.log(res.data);
                setUser(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getUser();
    }, [conversation.users._id])


    return (
        <div className='conversation'>
            <img src="https://via.placeholder.com/150" alt="avatar" className='conversationImg' />
            <span className='conversationName'>{user && user.username}
            </span>
        </div>
    )
}

export default Conversation