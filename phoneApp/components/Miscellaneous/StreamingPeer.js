import React from 'react'
import { Button, Flex, HStack, Icon, IconButton, VStack, Text } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import axios from 'axios'
import { backend_url } from '../../production'
import { RoomContext } from '../../context/RoomContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RTCView } from 'react-native-webrtc'

const Streaming = ({ fetchAgain, setFetchAgain, user, admin }) => {
    const [id, setId] = React.useState(null);

    const { selectedChat, dispatch } = React.useContext(PhoneAppContext);

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
        screenShare,
    } = React.useContext(RoomContext);

    React.useEffect(() => {
        const roomId = async () => {
            try {
                const value = await AsyncStorage.getItem('roomId')
                return value != null ? value : null
            } catch (e) {
                // read error
                console.log(e)
            }
        }

        roomId().then((res) => {
            setId(res);
        })
    }, [])

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
                dispatch({ type: "SET_STREAM" });
                await AsyncStorage.removeItem('roomId');
            } else {
                // toast({
                //     title: "Error",
                //     description: "Something went wrong",
                //     status: "error",
                //     duration: 3000,
                //     isClosable: true,
                // });
                console.log("error line 62");
            }
        } catch (error) {
            console.log(error);
            //     toast({
            //         title: "Error",
            //         description: "Something went wrong",
            //         status: "error",
            //         duration: 3000,
            //         isClosable: true,
            //     });
        }
    };

    const leaveStream = async () => {
        await AsyncStorage.removeItem('roomId');
        dispatch({ type: "SET_STREAM" });
    };

    const sendMeetingId = async () => {
        const data = {
            meetingId: id,
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
            setId(roomId());
        } catch (error) {
            console.log(error);
            // toast({
            //     title: "Error",
            //     description: "Something went wrong",
            //     status: "error",
            //     duration: 3000,
            //     isClosable: true,
            // });
        }
    };

    React.useEffect(() => {
        if (streamState)
            ws.emit("join-room", { roomId: id, peerId: me._id, userId });

        if (id) {
            sendMeetingId();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, me, streamState]);

    let adminVideo = Object.values(peers).filter(
        (peer) =>
            peer.userId === selectedChat.groupAdmin._id &&
            peer.stream !== undefined
    );
    // console.warn(adminVideo, "adminVideo", peers);

    React.useEffect(() => {
        setRoomId(id);
    }, [id, setRoomId]);

    const screenSharingVideo =
        screenSharingId === me?.id
            ? screenStream
            : peers[screenSharingId]?.stream;

    React.useEffect(() => {
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
                        // toast({
                        //     title: "Meeting Ended!",
                        //     description: "You are redirected to chat page",
                        //     status: "error",
                        //     isClosable: true,
                        //     position: "top",
                        //     duration: 5000,
                        // });
                        console.log("meeting ended");
                        leaveStream();
                    }
                };
                setTimeout(() => {
                    checkStream();
                }, 1000);
            } catch (error) {
                console.log(error)
                // toast({
                //     title: "Error Occured!",
                //     description: "Failed to Check Streaming Status",
                //     status: "error",
                //     isClosable: true,
                //     position: "top",
                //     duration: 5000,
                // });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminVideo]);

    return (
        <Flex flex={1} py={'1'} bg={'primary.100'}>
            {id && streamState !== null ? (
                <VStack flex={1} bg={'primary.100'}>
                    <Flex flex={1} bg={'primary.100'}>
                        {admin && screenSharingId !== me?.id && (
                            <RTCView
                                streamURL={admin && streamState.toURL()}
                                objectFit={'cover'}
                                style={{
                                    width: '50%',
                                    height: '50%',
                                }}
                                zOrder={0}
                            />
                        )}
                        {screenSharingVideo && (
                            <RTCView
                                streamURL={screenSharingVideo.toURL()}
                                objectFit={'cover'}
                                zOrder={0}
                            />
                        )}
                        {adminVideo.length > 0 ? adminVideo.map((peer) => (
                            <RTCView
                                key={peer.id}
                                streamURL={peer.stream.toURL()}
                                objectFit={'cover'}
                                zOrder={0}
                            />
                        )) : (
                            !admin && (
                                <Text>
                                    Waiting for Admin to join the meeting
                                </Text>
                            )
                        )}
                    </Flex>

                </VStack>
            ) : (
                <VStack flex={1} bg={'primary.100'}>
                    <Button onPress={sendMeetingId}>
                        {admin ? 'Start Meeting' : 'Join Meeting'}
                    </Button>
                    <Button onPress={() => {
                        dispatch({ type: "SET_STREAM" });
                    }}>Go to home screen</Button>
                </VStack>
            )}
        </Flex>
    )
}

export default Streaming