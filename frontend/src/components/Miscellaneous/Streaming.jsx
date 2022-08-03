import { Box, Button, Center, Divider, Flex, Heading, HStack, Icon, IconButton, Text, VStack } from '@chakra-ui/react';
import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import axios from 'axios';
import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { BsCameraVideo, BsCameraVideoOff, BsFillMicMuteFill, BsFullscreen, BsFullscreenExit, BsMic, BsMicFill, BsMicMute } from 'react-icons/bs';
import ReactPlayer from 'react-player';
import { AppContext } from '../../context/AppContext';
import { SocketContext } from '../../context/socketContext';
import { backend_url } from '../../production';

function VideoComponent(props) {
    console.warn("PARTICIPANTSS", props.participantId)
    const micRef = useRef(null);
    const { webcamStream, micStream, webcamOn, micOn } = useParticipant(
        props.participantId
    );

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
                        onError={(err) => {
                            console.log(err, "participant video error");
                        }}
                    />
                )}
            </Box>
        </div>
    );
}

function Controls({ setFetchAgain, user, selectedChat, dispatch }) {
    const [micOn, setMicOn] = React.useState(true);
    const { leave, toggleMic, toggleWebcam } = useMeeting();
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
        leave();

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
            console.warn(result, "result");
            if (result) {
                window.location.reload();
            } else {
                console.log("error");
            }

        } catch (error) {
            console.log(error);
        }
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
                        onClick={endStream}
                        bg='whiteColor'
                        variant='solid'
                        color={'errorColor'}
                        aria-label='Call Sage'
                        fontSize='20px'
                        icon={<AiOutlineCloseSquare />}
                    />
                    <Text>
                        Leave
                    </Text>
                </VStack>

            </Flex>
        </Flex>
    );
}

const Streaming = ({ meetingId, setFetchAgain }) => {
    console.warn("Streaming which is container", meetingId)
    const user = JSON.parse(localStorage.getItem('user'));
    const { selectedChat, streamExists, dispatch } = useContext(AppContext);
    const [joined, setJoined] = React.useState(false);
    const { join } = useMeeting();
    const { participants } = useMeeting();
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
            console.log(result);

        } catch (error) {
            console.log(error);
        }
    };

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
            bg={joined ? '' : 'whiteColor'}
        >
            {joined ? (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                    <Flex>
                        <VStack>
                            <Text>{selectedChat?.chatName.toUpperCase()}</Text>
                            <Text>Host: </Text>
                        </VStack>
                    </Flex>
                    <Divider orientation='horizontal' />
                    {[...participants.keys()].map((participantId) => (
                        <VideoComponent participantId={participantId} />
                    ))}
                    <Divider orientation='horizontal' />
                    <Controls setFetchAgain={setFetchAgain} user={user} selectedChat={selectedChat} dispatch={dispatch} />
                </Box>
            ) : (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                    {!streamExists ?
                        <>
                            <Text my={'3'}>
                                Create the meeting for the Others to join
                            </Text>
                            <Button color={'whiteColor'} bg={'buttonPrimaryColor'} onClick={joinMeeting}>Create a Meeting</Button>
                        </>
                        :
                        <>
                            <Text my={'3'}>
                                Join the already going on meeting
                            </Text>
                            <Button color={'whiteColor'} bg={'buttonPrimaryColor'} onClick={joinMeeting}>Join</Button>
                        </>
                    }
                </Box>
            )}
        </Box>
    )
}

export default Streaming