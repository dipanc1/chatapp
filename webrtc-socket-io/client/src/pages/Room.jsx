import React, { useContext, useEffect } from 'react'
import './room.css'
import { useParams } from "react-router-dom";
import { RoomContext } from '../context/RoomContext';
import Videoplayer from '../components/Videoplayer';

const Room = () => {
    let { id } = useParams();
    const { ws, me, stream, peers, startRecording, shareScreen, screenSharingId, setRoomId } = useContext(RoomContext);

    useEffect(() => {
        if (me) ws.emit("join-room", { roomId: id, peerId: me._id });
    }, [id, me, ws]);

    useEffect(() => {
        setRoomId(id);
    }, [id, setRoomId])

    console.log({ screenSharingId }, "Screen Sharing Id");

    const screenSharingVideo = screenSharingId === me?.id ? stream : peers[screenSharingId]?.stream;

    const { [screenSharingId]: sharing, ...peersToShow } = peers;

    return (
        <>
            <h2>
                Room ID : {id}
            </h2>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "20px",
                    flexWrap: "wrap"
                }}>
                {screenSharingVideo &&
                    (
                        <Videoplayer width={'300px'} stream={screenSharingVideo} />
                    )
                }

                {
                    screenSharingId !== me?.id &&
                    (
                        <Videoplayer width={'300px'} stream={stream} />
                    )
                }

                {Object.values(peersToShow).map((peer) =>
                    <div key={peer.stream.id}>
                        <Videoplayer width={'300px'} stream={peer.stream} />
                    </div>
                )}
            </div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "20px"
            }}>
                {/* <button onClick={startRecording}>Start Recording</button> */}
                <button onClick={shareScreen}>Share Screen</button>
            </div>
        </>
    )
}

export default Room