import React, { useContext, useEffect, useState } from 'react'
import AgoraUIKit, { layout } from 'agora-react-uikit';
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import './stream.scss'

const Stream = ({ children, streaming, setStreaming, fullScreenMode, setFullScreenMode, callactive, setCallactive, socket }) => {
    const { selectedChat } = useContext(PhoneNumberContext);
    const [show, setShow] = useState(false);
    const [transformmm, setTransformmm] = useState(false);
    const [videocall, setVideocall] = useState(true)
    const [isHost, setHost] = useState(false)
    const [fullScreen, setFullScreen] = useState(false);
    const [isPinned, setPinned] = useState(false);
    console.warn('callactive', callactive);
    // current user will be host other users will be audience
    const rtcProps = {
        appId: 'b73adb04d0a74614b6eeba2f4915cd17',
        channel: selectedChat.chatName, // your agora channel
        // token: '7b3ffd59228f48eb8605d091a8a32ec0', // use null or skip if using app in testing mode
        // callActive: callactive,
        // role: !callactive ? 'host' : 'audience',
        role: isHost ? 'host' : 'audience',
        layout: isPinned ? layout.pin : layout.grid,
    };
    console.warn(rtcProps);
    const callbacks = {
        EndCall: () => setVideocall(false),
    };
    const styleProps = {
        localBtnContainer: { backgroundColor: 'blueviolet', zIndex: '1' },
    };

    const rtmProps = {
        displayUserName: true,
    };

    const streamHandler = () => {
        setShow(!show);
        setStreaming(!streaming);
        setCallactive(!callactive);
    }

    useEffect(() => {
        socket.emit('call', {
            call: !callactive,
            chatId: selectedChat._id,
        });
      
    }, [selectedChat])
    

    const fullScreenHandler = () => {
        setFullScreen(!fullScreen)
        // setFullScreenMode(!fullScreenMode);
        // console.warn(fullScreenMode);
    }

    const styles = {
        stream: {
            display: 'flex',
            marginRight: '3vw',
            position: fullScreen ? 'absolute' : null,
            top: fullScreen ? 0 : null,
            left: fullScreen ? 0 : null,
            height: fullScreen ? '31vh' : null,
            width: fullScreen ? '100vw' : null,
            zIndex: fullScreen ? 1 : null,
        },

        container: {
            display: 'flex',
            backgroundColor: '#007bff22',
            width: fullScreen ? '100vw' : '51vw',
            height: fullScreen ? '100vh' : '50vh',
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
                    <span onClick={() => setShow(!show)}>{children}</span> :
                    <>

                        <img src="https://img.icons8.com/ios/50/000000/streamlabs-obs.png" alt='stream'
                            style={{
                                transform: transformmm ? 'scale(1.1) translateY(-2px)' : null,
                                cursor: 'pointer',
                                height: '40px',
                                marginLeft: '-38px',
                                transition: 'all 0.1s ease-in-out',
                            }}
                            onClick={streamHandler}
                            onMouseEnter={() => setTransformmm(true)}
                            onMouseLeave={() => setTransformmm(false)}
                        />
                    </>
            }
            {show &&
                <div style={styles.stream} className='stream'>
                    <div style={styles.container} className='container'>
                        {videocall
                            ? <>
                                <div style={styles.nav} className='nav'>
                                    <p style={{ fontSize: 20, width: 126, color: '#007bff', cursor: 'default' }}>You're {isHost ? 'a host' : 'an audience'}</p>
                                    <p style={styles.btn} onClick={() => setHost(!isHost)}>Change Role</p>
                                    <p style={styles.btn} onClick={fullScreenHandler}>{fullScreen ? 'Theatre Mode' : 'Full Screen Mode'}</p>
                                    {/* <p style={styles.btn} onClick={() => setPinned(!isPinned)}>Change Layout</p> */}
                                </div>
                                <AgoraUIKit
                                    rtcProps={rtcProps}
                                    callbacks={callbacks}
                                    styleProps={styleProps}
                                    rtmProps={rtmProps}
                                />
                            </>
                            :
                            <div style={styles.nav} className='nav'>
                                <p style={styles.btn} onClick={() => setFullScreen(!fullScreen)}>{fullScreen ? 'Theatre Mode' : 'Full Screen Mode'}</p>
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