import { Box, Button, Center, Divider, Flex, Heading, HStack, Icon, IconButton, Text, useToast, VStack } from '@chakra-ui/react';
import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import axios from 'axios';
import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { BsCameraVideo, BsCameraVideoOff, BsFillMicMuteFill, BsFullscreen, BsFullscreenExit, BsMic, BsMicFill, BsMicMute } from 'react-icons/bs';
import ReactPlayer from 'react-player';
import { AppContext } from '../../context/AppContext';
import { SocketContext } from '../../context/socketContext';
import { backend_url } from '../../baseApi';
import useSound from 'use-sound';
import joinSound from '../../sounds/join.mp3';
import leaveSound from '../../sounds/leave.mp3';

const videoPlayerStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'xl',
    border: '1px solid #000',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
};

function VideoComponent(props) {
    // console.warn("PARTICIPANTSS", props.participantId);

    const micRef = useRef(null);

    const { displayName, isActiveSpeaker, webcamStream, micStream, webcamOn, micOn } = useParticipant(
        props.participantId, {
        onStreamEnabled: (stream) => {
            // console.log('stream enabled', stream);
        },
        onStreamDisabled: (stream) => {
            // console.log('stream disabled', stream);
        }
    }
    );

    // console.log("Display Name", displayName, "Is Active Speaker", isActiveSpeaker);

    const videoStream = useMemo(() => {
        if (webcamOn) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("videoElem.current.play() failed", error)
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    return (
        <div key={props.participantId}>
            <Box>
                {micOn && micRef && <audio ref={micRef} autoPlay />}
                {webcamOn && (
                    <ReactPlayer
                        //
                        playsinline // very very imp prop
                        pip={false}
                        light={false}
                        controls={true}
                        muted={true}
                        playing={true}
                        //
                        url={videoStream}
                        //
                        height={"70vh"}
                        width={"100%"}
                        style={videoPlayerStyle}
                        onError={(err) => {
                            console.log(err, "participant video error");
                        }}
                    />
                )}
            </Box>
        </div>
    );
}

function Controls({ admin, user, selectedChat, dispatch }) {

    const toast = useToast();

    const [play] = useSound(joinSound);
    const [playLeave] = useSound(leaveSound);

    const { leave, toggleMic, toggleWebcam, end } = useMeeting({
        onParticipantJoined: (participant) => {
            play();
            toast({
                title: "Participant Joined",
                description: participant.displayName + " joined the meeting",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        },
        onParticipantLeft: (participant) => {
            playLeave();
            toast({
                title: "Participant Left",
                description: participant.displayName + " left the meeting",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        },
        onParticipantChanged: (participant) => {
            // console.log("participant changed", participant);
        }
    });

    const [micOn, setMicOn] = React.useState(true);
    const [webcamOn, setWebcamOn] = React.useState(false);
    const [fullscreenOn, setFullscreenOn] = React.useState(false);

    const micToggle = () => {
        setMicOn(!micOn);
        toggleMic();
    }

    const webcamToggle = () => {
        setWebcamOn(!webcamOn);
        toggleWebcam();
    }


    const fullscreenToggle = () => {
        setFullscreenOn(!fullscreenOn);
    }

    const endStream = async () => {
        end();

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const data = {
                chatId: selectedChat._id
            }
            const result = await axios.put(`${backend_url}/conversation/stop-stream`, { data }, config);
            // console.warn(result, "result");
            if (result) {
                window.location.reload();
            } else {
                console.log("error");
            }

        } catch (error) {
            console.log(error);
        }
    }

    const leaveStream = () => {
        leave();
        dispatch({ type: "SET_STREAMING", payload: false });
        window.location.reload();
    }


    return (
        <Flex width={'100%'} justify={'space-between'} pt={'5'} flexDirection={'row'}>
            <Flex width={'45%'} justify={'space-between'} flexDirection={'row'}>
                <VStack>
                    <IconButton
                        onClick={() => {
                            micToggle();
                        }}
                        bg='whiteColor'
                        variant='solid'
                        color={'tomato'}
                        aria-label='Call Sage'
                        fontSize='20px'
                        icon={micOn ? <BsMic /> : <BsMicMute />}
                    />
                    <Text>
                        {micOn ? 'Mic On' : 'Mic Off'}
                    </Text>
                </VStack>
                <VStack>
                    <IconButton
                        onClick={fullscreenToggle}
                        bg='whiteColor'
                        variant='solid'
                        color={'tomato'}
                        aria-label='Call Sage'
                        fontSize='20px'
                        icon={fullscreenOn ? <BsFullscreen /> : <BsFullscreenExit />}
                    />
                    <Text>
                        {fullscreenOn ? 'Full Screen' : 'Fit Screen'}
                    </Text>
                </VStack>
            </Flex>
            <Flex width={'45%'} justify={'space-between'} flexDirection={'row'}>
                <VStack>
                    <IconButton
                        onClick={webcamToggle}
                        bg='whiteColor'
                        variant='solid'
                        color={'buttonPrimaryColor'}
                        aria-label='Call Sage'
                        fontSize='20px'
                        icon={webcamOn ? <BsCameraVideo /> : <BsCameraVideoOff />}
                    />
                    <Text>
                        {webcamOn ? 'Webcam On' : 'Webcam Off'}
                    </Text>
                </VStack>
                <VStack>
                    <IconButton
                        onClick={admin ? endStream : leaveStream}
                        bg='whiteColor'
                        variant='solid'
                        color={'errorColor'}
                        aria-label='Call Sage'
                        fontSize='20px'
                        icon={<AiOutlineCloseSquare />}
                    />
                    <Text>
                        {admin ? 'End' : 'Leave'}
                    </Text>
                </VStack>

            </Flex>
        </Flex>
    );
}

const Streaming = ({ meetingId, setFetchAgain }) => {
    // console.warn("Streaming which is container", meetingId);

    const user = JSON.parse(localStorage.getItem('user'));

    const { selectedChat, streamExists, dispatch } = useContext(AppContext);

    const [joined, setJoined] = React.useState(false);
    const [meetingIdExists, setMeetingIdExists] = React.useState(false);

    const { join } = useMeeting();
    const { participants } = useMeeting();

    const admin = selectedChat?.groupAdmin._id === user._id;

    const joinMeeting = async () => {
        setJoined(true);
        join();
        const data = {
            meetingId: meetingId,
            chatId: selectedChat._id
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { result } = await axios.put(`${backend_url}/conversation/stream`, { data }, config);
            // console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        try {
            const checkStream = async () => {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.get(`${backend_url}/conversation/streaming/${selectedChat._id}`, config);
                if (data) {
                    setMeetingIdExists(true)
                } else {
                    setMeetingIdExists(false);
                }
            }
            checkStream();
        } catch (error) {
            console.log(error);
        }

    }, []);

    return (
        <Box
            height={'628px'}
            p={'1.5'}
            my={'5'}
            mx={['5', '10', '10', '10']}
            borderRadius={'xl'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            boxShadow={joined ? '' : 'dark-lg'}
            bg={joined ? '' : 'whiteColor'}
        >
            {joined ? (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                    <Flex>
                        <VStack>
                            <Text>Group Name: {selectedChat?.chatName.toUpperCase()}</Text>
                            <Text>Host: {selectedChat?.groupAdmin?.username}</Text>
                        </VStack>
                    </Flex>
                    <Divider orientation='horizontal' />
                    {[...participants.keys()].map((participantId) => (
                        <VideoComponent participantId={participantId} />
                    ))}
                    <Divider orientation='horizontal' />
                    <Controls admin={admin} user={user} selectedChat={selectedChat} dispatch={dispatch} />
                </Box>
            ) : (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                    {(admin || meetingIdExists) ? (
                        <>
                            <Heading my={'5'}>
                                {!meetingIdExists ? 'Create the meeting for the Others to join' : 'Join the already going on meeting'}
                            </Heading>
                            <Button color={'whiteColor'} bg={'buttonPrimaryColor'} onClick={joinMeeting}>{!meetingIdExists ? 'Create Meeting' : 'Join Meeting'}</Button>
                        </>
                    ) : (
                        <>
                            <Heading my={'5'}>
                                Waiting for the host to start the meeting
                            </Heading>

                            <Button color={'whiteColor'} bg={'errorColor'} onClick={() => {
                                window.location.reload();
                                setFetchAgain(true);
                            }}>Leave</Button>
                        </>
                    )}

                </Box>)
            }
        </Box >
    )
}

export default Streaming