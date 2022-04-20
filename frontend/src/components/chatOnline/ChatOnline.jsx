import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './chatOnline.scss'

const ENDPOINT = 'http://localhost:8000';
let socket;

const ChatOnline = ({ user1, handleFunction }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [online, setOnline] = useState(false);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", (userData) => {
            console.log(userData);
        });
        // have to work on this online feature?/?
    }, [user, user1._id]);

    return (
        <div className='chatOnline'>
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img src={user1.pic} alt="avatar" className="chatOnlineImg" />
                    <div className={online ? "chatOnlineBadgeOnline" : "chatOnlineBadge"}></div>
                </div>
                <div className="chatOnlineName">
                    <span>{user1.username}</span>
                    {user._id === user1._id ? null : <span className='chatOnlineCross' onClick={handleFunction}>X</span>}
                </div>
            </div>
        </div>
    )
}

export default ChatOnline