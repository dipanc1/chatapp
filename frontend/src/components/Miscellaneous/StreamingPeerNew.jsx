import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Text,
    Tooltip,
    useToast,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import {
    BsFullscreen,
    BsFullscreenExit,
    BsRecordCircle,
    BsRecordCircleFill,
} from "react-icons/bs";
import { AppContext } from "../../context/AppContext";
import { backend_url } from "../../baseApi";
import { MembersComponent } from "../UserChat/Members";
import { RoomContext } from "../../context/RoomContext";
import Videoplayer from "./Videoplayer";
import { NavLink } from "react-router-dom";

const IconButtonGeneric = ({
    icon,
    onClick,
    color,
    size,
    display,
    disable,
    toolTip,
}) => {
    return (
        <Tooltip label={toolTip} aria-label='A tooltip'>
            <IconButton
                bg="whiteColor"
                variant="solid"
                color={color}
                aria-label="Call Sage"
                fontSize="20px"
                onClick={onClick}
                icon={icon}
                size={size}
                display={display}
                isDisabled={disable}
            />
        </Tooltip>
    );
};

const StreamingPeer = ({ setToggleChat, admin, fetchAgain, setFetchAgain }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [recording, setRecording] = React.useState(false);
    const stopButton = useRef(null);

    const [id, setId] = React.useState(localStorage.getItem("roomId"));
    const [fullscreenOn, setFullscreenOn] = React.useState(false);

    const { selectedChat, dispatch, fullScreen, eventInfo } = useContext(AppContext);

    const {
        ws,
        me,
        streamState,
        peers,
        shareScreen,
        screenSharingId,
        setRoomId,
        userId,
        screenStream,
    } = useContext(RoomContext);

    const CDN_IMAGES = "https://ik.imagekit.io/sahildhingra";
    const toast = useToast();
    let recorder;

    const endStream = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const data = {
                chatId: selectedChat._id,
            };
            const result = await axios.put(
                `${backend_url}/conversation/stop-stream`,
                { data },
                config
            );
            // console.warn(result, "result");
            if (result) {
                window.location.reload();
                dispatch({ type: "SET_STREAM" });
                localStorage.removeItem("roomId");
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
    };

    const leaveStream = () => {
        localStorage.removeItem("roomId");
        dispatch({ type: "SET_STREAM" });
        window.location.reload();
    };

    const sendMeetingId = async () => {
        const data = {
            meetingId: localStorage.getItem("roomId"),
            chatId: selectedChat._id,
        };
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(
                `${backend_url}/conversation/stream`,
                { data },
                config
            );
            // console.log(result);
            setId(localStorage.getItem("roomId"));
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
    };

    useEffect(() => {
        if (streamState)
            ws.emit("join-room", { roomId: id, peerId: me._id, userId });

        if (id) {
            sendMeetingId();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, me, streamState]);

    const recordedChunks = [];

    if (streamState !== null) {
        recorder = new MediaRecorder(streamState);
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
                download();
            } else {
                console.log("Recording failed");
            }
        };
    }

    const download = async () => {
        const blob = new Blob(recordedChunks, {
            type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = `${selectedChat.chatName + " " + new Date()}.webm`;
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
    };

    let adminVideo = Object.values(peers).filter(
        (peer) =>
            peer.userId === selectedChat.groupAdmin._id &&
            peer.stream !== undefined
    );

    useEffect(() => {
        setRoomId(id);
    }, [id, setRoomId]);

    // console.log(
    //     { screenSharingId },
    //     "Screen Sharing Id",
    //     "adminVideo",
    //     adminVideo,
    //     "peers",
    //     peers,
    //     "me",
    //     me,
    //     "selectedChat",
    //     selectedChat
    // );

    const screenSharingVideo =
        screenSharingId === me?.id
            ? screenStream
            : peers[screenSharingId]?.stream;

    useEffect(() => {
        if (!admin) {
            try {
                const checkStream = async () => {
                    const config = {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const { data } = await axios.get(
                        `${backend_url}/conversation/streaming/${selectedChat._id}`,
                        config
                    );
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
                };
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
    }, [adminVideo]);

    // const { [screenSharingId]: sharing, ...peersToShow } = peers;

    return (
        <Box height={"100%"} flex={["12", "9", "9", "9"]}>
            {id && streamState !== null ? (
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    flexDirection={"column"}
                    p={["0", "50px 25px 0"]}
                    height={["100%", "auto"]}
                >
                    <Box
                        className="video-container"
                        width={"100%"}
                        boxShadow={['unset', "0px 3px 24px rgba(159, 133, 247, 0.6)"]}
                        borderRadius="5px"
                        overflow="hidden"
                        position="relative"
                        height={["30%", "auto"]}
                        flexShrink='0'
                    >
                        <Box transform="rotateY(180deg)" height={["100%", "unset"]}>
                            {admin && screenSharingId !== me?.id && (
                                <Videoplayer
                                    width={"100%"}
                                    peerstream={admin && streamState}
                                    admin={admin}
                                />
                            )}

                            {screenSharingVideo && (
                                <Box transform="rotateY(180deg)">
                                    <Videoplayer
                                        width={"100%"}
                                        peerstream={screenSharingVideo}
                                    />
                                </Box>
                            )}

                            {adminVideo.length > 0
                                ? adminVideo.map((peer) => (
                                    <div key={peer?.peerId}>
                                        <Videoplayer
                                            width={"100%"}
                                            peerstream={peer?.stream}
                                        />
                                    </div>
                                ))
                                : !admin && (
                                    <div>
                                        <Text>
                                            Admin left the meeting, Please
                                            wait or leave the meeting
                                        </Text>
                                    </div>
                                )}
                        </Box>
                        <Box
                            className="video-controls"
                            position="absolute"
                            bottom="0"
                            backgroundImage="linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))"
                            color="#fff"
                            width="100%"
                            p="50px 40px 20px"
                        >
                            {admin && fullScreen && (
                                <HStack
                                    justifyContent='center'
                                >

                                    <IconButtonGeneric
                                        onClick={startRecording}
                                        color={"tomato"}
                                        icon={<BsRecordCircle />}
                                        size={"md"}
                                        display={"flex"}
                                        disable={recording}
                                        toolTip={"Start Recording"}
                                    />
                                    <Tooltip label={"Stop Recording"} aria-label='A tooltip'>
                                        <IconButton
                                            bg="whiteColor"
                                            variant="solid"
                                            color={"tomato"}
                                            aria-label="Call Sage"
                                            fontSize="20px"
                                            icon={<BsRecordCircleFill />}
                                            size={"md"}
                                            display={"flex"}
                                            ref={stopButton}
                                            isDisabled={!recording}
                                        />
                                    </Tooltip>
                                    <Tooltip label={screenStream?.active ? 'Stop Sharing Screen' : 'Start Sharing Screen'} aria-label='A tooltip'>
                                        <button onClick={shareScreen}>
                                            {
                                                screenStream?.active ? (
                                                    <img src="https://ik.imagekit.io/sahildhingra/stop-screen-share.png" alt="share-screen" />
                                                ) : (
                                                    <img src="https://ik.imagekit.io/sahildhingra/screen-share.png" alt="share-screen" />
                                                )
                                            }
                                        </button>
                                    </Tooltip>
                                    <Tooltip label={"End Meeting"} aria-label='A tooltip'>
                                        <button onClick={endStream}>
                                            <img src="https://ik.imagekit.io/sahildhingra/hang-up.png" alt="end" />
                                        </button>
                                    </Tooltip>
                                </HStack>
                            )}
                            {
                                !admin && (
                                    <HStack justifyContent='center'>
                                        <button onClick={leaveStream}>
                                            <img src="https://ik.imagekit.io/sahildhingra/hang-up.png" alt="end" />
                                        </button>
                                    </HStack>
                                )
                            }
                            <>
                                <IconButtonGeneric
                                    onClick={fullscreenToggle}
                                    color={"tomato"}
                                    icon={
                                        fullscreenOn ? (
                                            <BsFullscreen />
                                        ) : (
                                            <BsFullscreenExit />
                                        )
                                    }
                                    size={fullScreen ? "md" : "sm"}
                                    display={["flex", "none!important", "none!important", "none!important"]}
                                />
                                <Text
                                    display={["block", "none", "none", "none"]}
                                    fontSize={fullScreen ? "15" : "7"}
                                >
                                    {fullscreenOn
                                        ? "Full Screen"
                                        : "Fit Screen"}
                                </Text>
                            </>
                        </Box>
                    </Box>
                    <Box p={['0 20px', '0']} overflow='auto' flex='1'>
                        <Heading pt='20px' pb='15px' as='h1' size='lg' fontWeight='500'>{eventInfo.title}</Heading>
                        <Text as='h2' size='lg' fontWeight='500' pb='35px'>
                            Host: {selectedChat.groupAdmin.username.toUpperCase()}
                        </Text>
                        <Flex justifyContent='end'>
                            <NavLink className='btn btn-primary'>
                                <Flex alignItems='center'>
                                    <Image h='18px' pe='15px' src={CDN_IMAGES + "/like-white.png"} />
                                    <Text>Like</Text>
                                </Flex>
                            </NavLink>
                            {/* <NavLink style={{ "margin": "0 20px" }} className='btn btn-primary'>
                                <Flex alignItems='center'>
                                    <Image h='18px' pe='15px' src={CDN_IMAGES + "/share-white.png"} />
                                    <Text>Share</Text>
                                </Flex>
                            </NavLink>
                            <NavLink className='btn btn-primary'>
                                <Flex alignItems='center'>
                                    <Image h='18px' pe='15px' src={CDN_IMAGES + "/save-white.png"} />
                                    <Text>Save</Text>
                                </Flex>
                            </NavLink> */}
                        </Flex>
                        <Box py='40px'><hr /></Box>
                        <Box>
                            <Flex gap='25px' fontWeight='bold'>
                                <Flex alignItems='center'>
                                    <Image h='18px' pe='6px' src={CDN_IMAGES + "/eye.png"} />
                                    <Text>{Object.keys(peers).length > 0 ? Object.keys(peers).length : 0} Watching</Text>
                                </Flex>
                                <Flex alignItems='center'>
                                    <Image h='18px' pe='6px' src={CDN_IMAGES + "/clock.png"} />
                                    <Text>Started {new Date().getMinutes() - eventInfo.time.split(":")[1]} Minutes ago</Text>
                                </Flex>
                            </Flex>
                            <Text pt='20px' pb='100px'>
                                {eventInfo.description}
                            </Text>
                        </Box>
                    </Box>
                    {!fullScreen && (
                        <Box
                            width={"100%"}
                            bg={"whiteColor"}
                            p={"1.5"}
                            borderRadius={"xl"}
                            display={["flex", "none", "none", "none"]}
                            boxShadow={"dark-lg"}
                        >
                            <MembersComponent
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                            />
                        </Box>
                    )}
                    <Box onClick={() => setToggleChat(true)} p='10px' background='#f0ecfb' display={['flex', 'none']} justifyContent='space-between' alignItems='center'>
                        <Text>Messages</Text>
                        <Image src="https://ik.imagekit.io/sahildhingra/down-arrow.png" h='20px' transform='rotate(180deg)' />
                    </Box>
                </Box>
            ) : (
                <Box
                    height={fullScreen ? "75vh" : ""}
                    p={fullScreen ? "1.5" : "0"}
                    my={fullScreen ? "5" : "0"}
                    mx={["5", "10", "10", "10"]}
                    borderRadius={"xl"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    bg={"whiteColor"}
                >
                    <VStack>
                        <Heading my={"5"} fontWeight='400' fontSize={['xl', 'xl', 'xl', '3xl']} color={'buttonPrimaryColor'}>
                            {admin
                                ? "Start streaming for other users to join"
                                : "Join the stream"}
                        </Heading>
                        <button
                            className="btn btn-primary"
                            my={"5"}
                            color={"whiteColor"}
                            bg={"buttonPrimaryColor"}
                            onClick={sendMeetingId}
                        >
                            {admin ? "Start" : "Join"}
                        </button>
                        <Button
                            color={"whiteColor"}
                            bg={"errorColor"}
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            Go to Home Page
                        </Button>
                    </VStack>
                </Box>
            )}
        </Box>
    );
};

export default StreamingPeer;
