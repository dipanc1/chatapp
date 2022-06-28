import React, { useContext, useEffect, useState } from 'react'
import AgoraUIKit, { layout } from 'agora-react-uikit';
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import './stream.scss'
import { AiOutlineVideoCamera } from 'react-icons/ai'
import { Button } from '@chakra-ui/react';


const Stream = ({ children, streaming, setStreaming, fullScreenMode, setFullScreenMode, calling, setCalling, isCalling, socket, setVideocall, videocall }) => {
    const { selectedChat } = useContext(PhoneNumberContext);
    const [transformmm, setTransformmm] = useState(false);
    const [isHost, setHost] = useState(false);
    const [isPinned, setPinned] = useState(false);
    const rtcProps = {
        appId: 'b73adb04d0a74614b6eeba2f4915cd17',
        channel: selectedChat.chatName, // your agora channel
        // token: '7b3ffd59228f48eb8605d091a8a32ec0', // use null or skip if using app in testing mode
        role: isHost ? 'host' : 'audience',
        layout: isPinned ? layout.pin : layout.grid,
        disableRtm: true,
    };

    const callbacks = {
        EndCall: () => setVideocall(false),
    };

    const styleProps = {
        localBtnContainer: { backgroundColor: '#004dfa' },
    };


    const streamHandler = () => {
        setStreaming(!streaming);
        // setVideocall(!videocall);
        if (!videocall) {
            setVideocall(true);
            socket.emit("calling", selectedChat._id);
        }
        if (videocall) {
            socket.emit("stop calling", selectedChat._id);
            setVideocall(false);
        }
    }

    const fullScreenHandler = () => {
        setFullScreenMode(!fullScreenMode)
    }

    const styles = {
        stream: {
            display: 'flex',
            marginRight: '3vw',
            position: fullScreenMode ? 'absolute' : null,
            top: fullScreenMode ? 0 : null,
            left: fullScreenMode ? 0 : null,
            height: fullScreenMode ? '31vh' : null,
            width: fullScreenMode ? '100vw' : null,
            zIndex: fullScreenMode ? 1 : null,
        },

        container: {
            display: 'flex',
            backgroundColor: '#007bff22',
            width: fullScreenMode ? '100vw' : '51vw',
            height: fullScreenMode ? '100vh' : '50vh',
        },

        nav: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0.5rem',
            backgroundColor: '#007bff22',
        },

        btn: {
            display: 'flex',
            flexDirecton: 'column',
            backgroundColor: '#007bff',
            cursor: 'pointer',
            borderRadius: 5,
            padding: 5,
            margin: 5,
            color: '#ffffff',
            fontSize: 20
        },
    }


    return (
        <>
            {
                children ?
                    <span onClick={() => setStreaming(!streaming)}>{children}</span> :
                    <>
                        <Button onClick={streamHandler}
                            onMouseEnter={() => setTransformmm(true)}
                            onMouseLeave={() => setTransformmm(false)}
                            style={{
                                filter: isCalling ? 'invert(44%) sepia(53%) saturate(4971%) hue-rotate(336deg) brightness(129%) contrast(113%)' : null,
                            }}>
                            <AiOutlineVideoCamera />
                        </Button>
                    </>
            }
            {streaming &&
                <div style={styles.stream} className='stream'>
                    <div style={styles.container} className='container'>
                        {videocall
                            ? <>
                                <div style={styles.nav} className='nav'>
                                    <p style={{ fontSize: 20, width: 126, color: '#007bff', cursor: 'default' }}>You're {isHost ? 'a host' : 'an audience'}</p>
                                    <p style={styles.btn} onClick={() => setHost(!isHost)}>Change Role</p>
                                    <p style={styles.btn} onClick={fullScreenHandler}>{fullScreenMode ? 'Theatre Mode' : 'Full Screen Mode'}</p>
                                    {/* <p style={styles.btn} onClick={() => setPinned(!isPinned)}>Change Layout</p> */}
                                </div>
                                <AgoraUIKit
                                    rtcProps={rtcProps}
                                    callbacks={callbacks}
                                    styleProps={styleProps}
                                />
                            </>
                            :
                            <div style={styles.nav} className='nav'>
                                <p style={styles.btn} onClick={() => setFullScreenMode(!fullScreenMode)}>{fullScreenMode ? 'Theatre Mode' : 'Full Screen Mode'}</p>
                                <h3 style={styles.btn} onClick={() => setVideocall(true)}>Start Call</h3>
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default Stream