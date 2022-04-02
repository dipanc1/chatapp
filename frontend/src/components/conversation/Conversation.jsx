import axios from 'axios';
import { useEffect, useState } from 'react'
import './conversation.scss'

const Conversation = ({ conversation, currentUser }) => {

    // const friendId = conversation.members.find(member => member !== currentUser._id);
    // console.log(friendId)

    // console.log(currentUser._id)

    const [user, setUser] = useState(null);

    useEffect(() => {
        const friendId = conversation.members.find(member => member !== currentUser._id);
        // console.log(friendId)
        const getUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/users?userId=${friendId}`)
                console.log(res.data);
                setUser(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getUser();
    }, [conversation.members, currentUser._id])


    return (
        <div className='conversation'>
            <img src="https://via.placeholder.com/150" alt="avatar" className='conversationImg' />
            <span className='conversationName'>{user && user.username}
            </span>
        </div>
    )
}

export default Conversation