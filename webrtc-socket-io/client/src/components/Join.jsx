import React from 'react'
import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import "./button.css"

const Join = () => {
    const { ws } = useContext(RoomContext);

    const createRoom = () => {
        ws.emit("create-room");
    };

    return (
        <div style={{display:'flex', flexDirection:'column'}}>
            <button
                className='createMeetingButton'
                onClick={createRoom}
            >
                Start a new meeting
            </button>
        </div>
    );
}

export default Join