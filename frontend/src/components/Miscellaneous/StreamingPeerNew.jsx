import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Img,
    Input,
    Text,
    Tooltip,
    useColorMode,
    useDisclosure,
    useToast,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef } from "react";
import {
    BsFullscreen,
    BsRecordCircle,
    BsRecordCircleFill,
} from "react-icons/bs";
import Cookies from "universal-cookie";
import { AppContext } from "../../context/AppContext";
import { MembersComponent } from "../UserChat/Members";
import { RoomContext } from "../../context/RoomContext";
import Videoplayer from "./Videoplayer";
import conversationApi from "../../services/apis/conversationApi";
import donationApi from "../../services/apis/donationApi";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { backend_url } from "../../utils";

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
    const cookies = new Cookies();
    const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" });

    const [recording, setRecording] = React.useState(false);
    const [toggleDonation, setToggleDonation] = React.useState(false);
    const [targetAmount, setTargetAmount] = React.useState('');
    const [currentAmount, setCurrentAmount] = React.useState('');
    const [peopleContributed, setPeopleContributed] = React.useState(0);
    const [name, setName] = React.useState('');
    const [refresh, setRefresh] = React.useState(false);
    const [contributeAmount, setContributeAmount] = React.useState('');
    const [donationId, setDonationId] = React.useState('');
    const [clientSecret, setClientSecret] = React.useState("");

    const [id, setId] = React.useState(localStorage.getItem("roomId"));

    const { selectedChat,
        dispatch,
        fullScreen,
        eventInfo } = useContext(AppContext);

    const stopButton = useRef(null);

    const stripePromise = loadStripe("pk_test_51N136dLHtaKT8adL3kfRwpts2g1xBKHE9A1flPHC1eE5rQzHZHO6NcdCNZEmuQWJ2lZiqMJ0hdeqRUdWvaWnVkaa000amUm8tU");

    const { isOpen, onOpen, onClose } = useDisclosure()

    React.useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        // fetch(`${backend_url}/checkout/create-payment-intent`, {
        // method: "POST",
        // headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
        // })
        // .then((res) => res.json())
        // .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

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
        participantsArray
    } = useContext(RoomContext);

    const CDN_IMAGES = "https://ik.imagekit.io/sahildhingra";

    const toast = useToast();
    const { colorMode } = useColorMode();

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
            const result = await conversationApi.stopStream(
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
            await conversationApi.startStream(
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
                    const { data } = await conversationApi.checkStream(selectedChat._id, config);
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


    useEffect(() => {
        if (streamState)
            ws.emit("join-room", { roomId: id, peerId: me._id, userId });

        if (id) {
            sendMeetingId();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, me, streamState]);

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };
        const donation = async () => {
            const { data } = await donationApi.getDonationOfAnEvent(eventInfo.id, config);
            if (data.length > 0) {
                setDonationId(data[0]._id);
                setTargetAmount(data[0].targetAmount);
                setName(data[0].name);
                setCurrentAmount(data[0].currentAmount);
                setPeopleContributed(data[0].donatedByAndAmount.length);
                setRefresh(false);
            }
        }

        donation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])

    const percentage = (currentAmount / targetAmount) * 100;

    const contributeToFundraising = async () => {
        if (contributeAmount === '' || contributeAmount === '0') {
            toast({
                title: "Error Occured!",
                description: "Please enter amount",
                status: "error",
                isClosable: true,
                position: "bottom",
                duration: 5000,
            });
            return;
        }
        try {
            onOpen()
            fetch(`${backend_url}/checkout/create-payment-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseInt(contributeAmount) }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
            // const config = {
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${user.token}`,
            //     },
            // };
            // const { data } = await donationApi.contributeToDonation(donationId, { amount: parseInt(contributeAmount) }, config);
            // if (data) {
            //     toast({
            //         title: "Donation Successful!",
            //         description: "Thank you for your contribution",
            //         status: "success",
            //         isClosable: true,
            //         position: "bottom",
            //         duration: 5000,
            //     });

            //     setContributeAmount('');
            //     setToggleDonation(false);
            //     setCurrentAmount(data.currentAmount);
            //     setTargetAmount(data.targetAmount);
            //     setPeopleContributed(data.donatedByAndAmount.length);
            // }
        } catch (error) {
            // toast({
            //     title: "Error Occured!",
            //     description: "Failed to contribute to fundraising",
            //     status: "error",
            //     isClosable: true,
            //     position: "bottom",
            //     duration: 5000,
            // });
            console.log(error);
        }
    }

    const screenSharingVideo =
        screenSharingId === me?.id
            ? screenStream
            : peers[screenSharingId]?.stream;

    return (
        <Box height={"100%"} flex={["12", "9", "9", "9"]}>
            {id && streamState !== null ? (
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    flexDirection={"column"}
                    p={["0", "25px 25px"]}
                    height={["100%", "auto"]}
                >
                    <Box
                        key={id}
                        className="video-container"
                        width={"100%"}
                        boxShadow={['unset', "0px 3px 24px rgba(159, 133, 247, 0.6)"]}
                        borderRadius="5px"
                        overflow="hidden"
                        position="relative"
                        height={["30%", "auto"]}
                        flexShrink='0'
                    >
                        <Box transform="rotateY(180deg)" height={["100%", "67vh"]}>
                            {admin && screenSharingId !== me?.id && (
                                <Videoplayer
                                    width={"100%"}
                                    peerstream={admin && streamState}
                                    admin={admin}
                                />
                            )}

                            {screenSharingVideo && (
                                <Box height={["100%", "67vh"]}>
                                    <Videoplayer
                                        width={"100%"}
                                        peerstream={screenSharingVideo}
                                    />
                                </Box>
                            )}

                            {adminVideo.length > 0
                                ? adminVideo.map((peer) => (
                                    <Box key={peer?.peerId} height={["100%", "67vh"]}>
                                        <Videoplayer
                                            width={"100%"}
                                            peerstream={peer?.stream}
                                        />
                                    </Box>
                                ))
                                : !admin && (
                                    <Box transform="rotateY(180deg)" height={["100%", "67vh"]}>
                                        <Text>
                                            Admin left the meeting, Please
                                            wait or leave the meeting
                                        </Text>
                                    </Box>
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
                            {admin && (
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
                                        <IconButtonGeneric
                                            onClick={fullscreenToggle}
                                            color={"tomato"}
                                            icon={
                                                <BsFullscreen />
                                            }
                                            size={fullScreen ? "md" : "sm"}
                                            display={["flex"]}
                                            toolTip={
                                                "Fullscreen"
                                            }
                                        />
                                        <Tooltip label={"Leave Meeting"} aria-label='A tooltip'>
                                            <button onClick={leaveStream}>
                                                <img src="https://ik.imagekit.io/sahildhingra/hang-up.png" alt="end" />
                                            </button>
                                        </Tooltip>
                                    </HStack>
                                )
                            }

                        </Box>
                    </Box>

                    <Box p={['0 20px', '0']} overflow='auto' flex='1'>
                        <Heading pt='20px' pb='15px' as='h1' size='lg' fontWeight='500'>{eventInfo.title}</Heading>
                        <Text as='h2' size='lg' fontWeight='500' pb='15px'>
                            Host: {selectedChat.groupAdmin.username.toUpperCase()}
                        </Text>
                        <Box position={"relative"}>
                            {admin ?
                                <>
                                    <Flex position={"relative"} mb="10px" h="12px" background={"#e6e6e6"} borderRadius={"10px"} overflow={"hidden"}>
                                        <Box textAlign={"right"} background={"#ffd700"} h="100%" w={percentage + "%"}>
                                            <Text fontSize={"10px"} pe="5px">
                                                ${currentAmount}
                                            </Text>
                                        </Box>
                                        <Text position={"absolute"} top="0" right="0" fontSize={"10px"} pe="10px">
                                            ${targetAmount}
                                        </Text>
                                    </Flex>
                                    <Flex pb="15px" color="#1c1c1c" fontSize={"13px"} justifyContent={"space-between"}>
                                        <Text>{peopleContributed} People Contributed</Text>
                                        <Text>${currentAmount} / ${targetAmount} Raised</Text>
                                    </Flex>
                                    <button className='btn btn-primary' disabled={
                                        refresh ? true : false
                                    } onClick={
                                        () => {
                                            setRefresh(!refresh);
                                        }
                                    }>
                                        {refresh ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                </>
                                :
                                <>
                                    <Button
                                        background="transparent"
                                        h='3rem'
                                        w='3rem'
                                        onClick={() => setToggleDonation(!toggleDonation)}
                                    >
                                        <Img
                                            filter={colorMode === 'light' ? '' : 'invert(1) brightness(10)'}
                                            h='20px'
                                            src="https://ik.imagekit.io/sahildhingra/dollar.png" alt="" />
                                    </Button>
                                    <Box
                                        position={"absolute"}
                                        top="0"
                                        left="4rem"
                                        shadow={"lg"}
                                        p="10px 20px"
                                        bg="#fff"
                                        borderRadius={"5px"}
                                        zIndex={"1"}
                                        minWidth={"420px"}
                                        whiteSpace={"pre"}
                                        transition={"all 0.15s ease-in-out"}
                                        opacity={toggleDonation ? "1" : "0"}
                                        transform={toggleDonation ? "unset" : "translateY(15px)"}
                                    >
                                        <Text pb="10px" fontSize={"18px"} as={"h1"} whiteSpace={"pre"}>
                                            Support Fundraising
                                        </Text>
                                        <Flex pb="10px" gap="10px" alignItems={"center"} justifyContent={"space-between"}>
                                            <Text whiteSpace={"pre"} color="#1c1c1c">{name}</Text>
                                            <Input value={contributeAmount} onChange={
                                                (e) => setContributeAmount(e.target.value)
                                            } w="120px" p="5px" fontSize="14px" type="number" placeholder='Enter Amount' />
                                        </Flex>
                                        <Flex position={"relative"} mb="10px" h="12px" background={"#e6e6e6"} borderRadius={"10px"} overflow={"hidden"}>
                                            <Box textAlign={"right"} background={"#ffd700"} h="100%" w={percentage + "%"}>
                                                <Text fontSize={"10px"} pe="5px">
                                                    ${currentAmount}
                                                </Text>
                                            </Box>
                                            <Text position={"absolute"} top="0" right="0" fontSize={"10px"} pe="10px">
                                                ${targetAmount}
                                            </Text>
                                        </Flex>
                                        <Flex pb="15px" color="#1c1c1c" fontSize={"13px"} justifyContent={"space-between"}>
                                            <Text>{peopleContributed} People Contributed</Text>
                                            <Text>${currentAmount} / ${targetAmount} Raised</Text>
                                        </Flex>
                                        <Box textAlign={"right"}>
                                            <button disabled={
                                                contributeAmount === '' ? true : false
                                            } button className='btn btn-primary' onClick={
                                                () => contributeToFundraising()
                                            }>Contribute</button>
                                        </Box>
                                    </Box>
                                </>
                            }
                        </Box>
                        <Box py='30px'><hr /></Box>
                        <Box>
                            <Flex gap='25px' fontWeight='bold'>
                                <Flex alignItems='center'>
                                    <Image h='18px' pe='6px' src={CDN_IMAGES + "/eye.png"} />
                                    <Text>{participantsArray.length > 0 ? participantsArray.length : 0} Watching</Text>
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Payment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm donationId={donationId} />
                            </Elements>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default StreamingPeer;
