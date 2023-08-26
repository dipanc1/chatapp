import { Box, Button, Divider, Flex, Heading, HStack, IconButton, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import axios from 'axios';
import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { BsCameraVideo, BsCameraVideoOff, BsFullscreen, BsFullscreenExit, BsMic, BsMicMute, BsRecordCircle, BsRecordCircleFill } from 'react-icons/bs';
import { MdScreenShare } from 'react-icons/md';
import ReactPlayer from 'react-player';
import { AppContext } from '../../context/AppContext';
import { backend_url } from '../../baseApi';
import { MembersComponent } from '../UserChat/Members';
import EndLeaveModal from '../UserModals/EndLeaveModal';
import { RoomContext } from '../../context/RoomContext';
import Videoplayer from './Videoplayer';
import { useCallback } from 'react';

const IconButtonGeneric = ({ icon, onClick, color, size, display, disable }) => {
    return (
        <IconButton
            bg='whiteColor'
            variant='solid'
            color={color}
            aria-label='Call Sage'
            fontSize='20px'
            onClick={onClick}
            icon={icon}
            size={size}
            display={display}
            isDisabled={disable}
        />
    )
}

const StreamingPeer = ({ admin, fetchAgain, setFetchAgain }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [recording, setRecording] = React.useState(false);
    const stopButton = useRef(null);

    const [id, setId] = React.useState(localStorage.getItem('roomId'));
    const [fullscreenOn, setFullscreenOn] = React.useState(false);

    // console.warn("StreamingPeer which is container", id);
    const { selectedChat, dispatch, fullScreen } = useContext(AppContext);
    const { ws, me, streamState, peers, shareScreen, screenSharingId, setRoomId, userId, screenStream } = useContext(RoomContext);

    const toast = useToast();
    let recorder;

    const endStream = async () => {
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
                dispatch({ type: "SET_STREAM" });
                localStorage.removeItem('roomId');
            } else {
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }

        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    const leaveStream = () => {
        localStorage.removeItem('roomId');
        dispatch({ type: "SET_STREAM" });
        window.location.reload();
    }

    const sendMeetingId = async () => {
        const data = {
            meetingId: localStorage.getItem('roomId'),
            chatId: selectedChat._id
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            await axios.put(`${backend_url}/conversation/stream`, { data }, config);
            // console.log(result);
            setId(localStorage.getItem('roomId'));
        } catch (error) {
            // console.log(error);
            toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    useEffect(() => {
        if (streamState) ws.emit("join-room", { roomId: id, peerId: me._id, userId });

        if (id) {
            sendMeetingId();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, me, streamState])

    const recordedChunks = [];

    if (streamState !== null) {
        recorder = new MediaRecorder(streamState);
        recorder.ondataavailable = (e) => {
            console.log(e.data);
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
                console.log(recordedChunks);
                download();
            } else {
                console.log("Recording failed");
            }
        };
    }

    const download = () => {
        const blob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "test.webm";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const startRecording = () => {
        recorder.start();
        setRecording(true);

        if (stopButton && stopButton.current) {
            stopButton.current.addEventListener("click", stopRecording);
        }

    };

    const stopRecording = () => {
        recorder.stop();
        setRecording(false);
        if (stopButton && stopButton.current) {
            stopButton.current.removeEventListener("click", stopRecording);
        }
    };

    const fullscreenToggle = () => {
        setFullscreenOn(!fullscreenOn);
        dispatch({ type: "SET_FULLSCREEN" });
    }

    let adminVideo = Object.values(peers).filter(peer => peer.userId === selectedChat.groupAdmin._id && peer.stream !== undefined);

    useEffect(() => {
        setRoomId(id);
    }, [id, setRoomId])

    // console.log({ screenSharingId }, "Screen Sharing Id", "adminVideo", adminVideo, "peers", peers, "me", me, "selectedChat", selectedChat);

    const screenSharingVideo = screenSharingId === me?.id ? screenStream : peers[screenSharingId]?.stream;

    useEffect(() => {
        if (!admin) {
            try {
                const checkStream = async () => {
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        }
                    }
                    const { data } = await axios.get(`${backend_url}/conversation/streaming/${selectedChat._id}`, config);
                    if (!data) {
                        toast({
                            title: "Meeting Ended!",
                            description: "You are redirected to chat page",
                            status: "error",
                            isClosable: true,
                            position: "top",
                            duration: 5000,
                        });
                        leaveStream();
                    }
                }
                setTimeout(() => {
                    checkStream();
                }, 1000);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Check Streaming Status",
                    status: "error",
                    isClosable: true,
                    position: "top",
                    duration: 5000,
                });
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminVideo])


    // const { [screenSharingId]: sharing, ...peersToShow } = peers;

    return (
        <Box flex={['12', '9', '9', '9']}>
            {(id && streamState !== null) ?
                <Box
                    height={fullScreen ? '85vh' : ''}
                    p={fullScreen ? '1.5' : '0'}
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    flexDirection={'column'}
                >
                    <Text m={'3'}>Host: {selectedChat.groupAdmin.username}</Text>
                    <Box>

                        {(admin && screenSharingId !== me?.id) && <Videoplayer width={'600px'} peerstream={admin && streamState} />}

                        {screenSharingVideo &&
                            (
                                <Videoplayer width={'400px'} peerstream={screenSharingVideo} />
                            )
                        }

                        {
                            adminVideo.length > 0 ?
                            adminVideo.map((peer) => (
                                <div key={peer?.peerId}>
                                    <Videoplayer width={'400px'} peerstream={peer?.stream} />
                                </div>
                            ))
                                :
                                !admin &&
                                <div>
                                    <Text>Admin left the meeting, Please wait or leave the meeting</Text>
                                </div>

                        }
                    </Box>
                    <VStack m={'2'}>
                        {(admin && fullScreen) &&
                            <HStack m={'3'}>
                                <IconButtonGeneric
                                    onClick={startRecording}
                                    color={'tomato'}
                                    icon={<BsRecordCircle />}
                                    size={'md'}
                                    display={'flex'}
                                    disable={recording}
                                />
                                <Text>
                                    Start Recording
                                </Text>
                                <IconButton
                                    bg='whiteColor'
                                    variant='solid'
                                    color={'tomato'}
                                    aria-label='Call Sage'
                                    fontSize='20px'
                                    icon={<BsRecordCircleFill />}
                                    size={'md'}
                                    display={'flex'}
                                    ref={stopButton}
                                    isDisabled={!recording}
                                />

                                <Text>
                                    Stop Recording
                                </Text>
                            </HStack>
                        }
                        <>
                            <IconButtonGeneric
                                onClick={fullscreenToggle}
                                color={'tomato'}
                                icon={fullscreenOn ? <BsFullscreen /> : <BsFullscreenExit />}
                                size={fullScreen ? 'md' : 'sm'}
                                display={['flex', 'none', 'none', 'none']}
                            />
                            <Text display={['block', 'none', 'none', 'none']} fontSize={fullScreen ? '15' : '7'}>
                                {fullscreenOn ? 'Full Screen' : 'Fit Screen'}
                            </Text>
                        </>
                        {fullScreen &&
                            <HStack>
                                {admin &&
                                    <>
                                        <IconButton
                                            onClick={shareScreen}
                                            bg='whiteColor'
                                            variant='solid'
                                            color={'tomato'}
                                            aria-label='Call Sage'
                                            fontSize='20px'
                                            icon={<MdScreenShare />}
                                            size={'md'}
                                            display={'flex'}
                                        />
                                        <Text>
                                            Share Screen
                                        </Text>
                                    </>
                                }
                                <IconButtonGeneric
                                    onClick={admin ? endStream : leaveStream}
                                    color={'errorColor'}
                                    icon={<AiOutlineCloseSquare />}
                                    size={'md'}
                                    display={'flex'}
                                />
                                <Text fontSize={'15'}>
                                    {admin ? 'End' : 'Leave'}
                                </Text>
                            </HStack>
                        }
                    </VStack>
                    {!fullScreen && <Box
                        width={'100%'}
                        bg={'whiteColor'}
                        p={'1.5'}
                        borderRadius={'xl'}
                        display={['flex', 'none', 'none', 'none']}
                        boxShadow={'dark-lg'}>

                        <MembersComponent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

                    </Box>}
                </Box>
                :
                <Box
                    height={fullScreen ? '85vh' : ''}
                    p={fullScreen ? '1.5' : '0'}
                    my={fullScreen ? '5' : '0'}
                    mx={['5', '10', '10', '10']}
                    borderRadius={'xl'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    boxShadow={'dark-lg'}
                    bg={'whiteColor'}
                >
                    <VStack>
                        <Heading my={'5'}>
                            {admin ? 'Start streaming for other users to join' : 'Join the stream'}
                        </Heading>
                        <Button my={'5'} color={'whiteColor'} bg={'buttonPrimaryColor'} onClick={sendMeetingId}>
                            {admin ? 'Start' : 'Join'}
                        </Button>
                        <Button color={'whiteColor'} bg={'errorColor'} onClick={() => {
                            window.location.reload();
                        }}>Go to Home Page</Button>
                    </VStack>
                </Box>
            }
        </Box >
    )
}

export default StreamingPeer