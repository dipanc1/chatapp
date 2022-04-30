import React, { useContext, useState } from 'react'
import AgoraUIKit, { layout } from 'agora-react-uikit';
import { PhoneNumberContext } from '../../context/phoneNumberContext';

const Stream = ({ children }) => {
    const { selectedChat } = useContext(PhoneNumberContext);
    const [show, setShow] = useState(false);
    const [transformmm, setTransformmm] = useState(false);
    const [videocall, setVideocall] = useState(true)
    const [isHost, setHost] = useState(false)
    const [isPinned, setPinned] = useState(false)
    console.log(selectedChat);
    // current user will be host other users will be audience
    const rtcProps = {
        appId: 'b73adb04d0a74614b6eeba2f4915cd17',
        channel: selectedChat.chatName, // your agora channel
        // token: '7b3ffd59228f48eb8605d091a8a32ec0', // use null or skip if using app in testing mode
        role: isHost ? 'host' : 'audience',
        layout: isPinned ? layout.pin : layout.grid,
    };
    const callbacks = {
        EndCall: () => setVideocall(false),
    };
    const styleProps = {
        localBtnContainer: { backgroundColor: 'blueviolet' },
    }

    const styles = {
        stream: { position: 'relative' },
        container: { display: 'flex', backgroundColor: '#007bff22', position: 'absolute', width: '71vw', height: '71vh', top: '-15vh', left: '-72vw', flexDirecton: 'column' },

        nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#007bff22' },
        btn: { display: 'flex', backgroundColor: '#007bff', cursor: 'pointer', borderRadius: 5, padding: 5, margin: 5, color: '#ffffff', fontSize: 20 },
    }


    return (
        <>
            {
                children ?
                    <span onClick={() => setShow(!show)}>{children}</span> :
                    <img src="https://img.icons8.com/ios/50/000000/streamlabs-obs.png" alt='stream'
                        style={{
                            transform: transformmm ? 'scale(1.1) translateY(-2px)' : null,
                            transition: 'all 0.1s ease-in-out',
                            cursor: 'pointer',
                            height: '40px',
                        }}
                        onClick={() => setShow(!show)}
                        onMouseEnter={() => setTransformmm(true)}
                        onMouseLeave={() => setTransformmm(false)}
                    />
            }
            {show &&
                <div style={styles.stream}>
                    <div style={styles.container}>
                        {videocall
                            ? <>
                                <div style={styles.nav}>
                                    <p style={{ fontSize: 20, width: 200, color: '#007bff', cursor: 'default'}}>You're {isHost ? 'a host' : 'an audience'}</p>
                                    <p style={styles.btn} onClick={() => setHost(!isHost)}>Change Role</p>
                                    <p style={styles.btn} onClick={() => setPinned(!isPinned)}>Change Layout</p>
                                </div>
                                <AgoraUIKit
                                    rtcProps={rtcProps}
                                    callbacks={callbacks}
                                    styleProps={styleProps}
                                />
                            </>
                            :
                            <div style={styles.nav}>
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