import React from 'react'
import { Button, Flex, HStack, Icon, IconButton, VStack, Text } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import { RTCView, useMeeting, useParticipant } from '@videosdk.live/react-native-sdk'
import axios from 'axios'
import { backend_url } from '../../production'

function Controls({ setFetchAgain, user, selectedChat, dispatch }) {
    const [micOn, setMicOn] = React.useState(true);
    const { leave, toggleMic, toggleWebcam } = useMeeting();
    const [webcamOn, setWebcamOn] = React.useState(false);

    const micToggle = () => {
        setMicOn(!micOn);
        toggleMic();
    }


    const webcamToggle = () => {
        setWebcamOn(!webcamOn);
        toggleWebcam();
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
            // console.warn(result, "result");
            if (result) {
                dispatch({ type: 'SET_STREAM', payload: false })
            } else {
                console.log("error");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <HStack flex={'3'} mx={'2'} justifyContent={'space-between'}>
            <Flex justifyContent={'center'} alignItems={'center'}>
                <IconButton onPress={webcamToggle} bg={'primary.200'} icon={<MaterialIcons name={webcamOn ? "videocam" : "videocam-off"} size={24} color="#9F85F7" />} />
                <Text>{webcamOn ? 'Front Cam' : 'Rear Cam'}</Text>
            </Flex>

            <Flex justifyContent={'center'} alignItems={'center'}>
                <IconButton onPress={() => micToggle()} bg={'primary.200'} icon={<MaterialIcons name={micOn ? "mic" : "mic-off"} size={24} color="#EFAA86" />} />
                <Text>{micOn ? 'Unmute' : 'Mute'}</Text>
            </Flex>

            <Flex justifyContent={'center'} alignItems={'center'}>
                <IconButton onPress={
                    () => { dispatch({ type: 'SET_FULLSCREEN', payload: true }) }
                } bg={'primary.200'} icon={<MaterialIcons name="fullscreen" size={24} color="#EFAA86" />} />
                <Text>Full Screen</Text>
            </Flex>

            <Flex justifyContent={'center'} alignItems={'center'}>
                <IconButton onPress={endStream} bg={'primary.200'} icon={<MaterialIcons name="cancel-presentation" size={24} color="#ff4343" />} />
                <Text>Leave</Text>
            </Flex>
        </HStack>
    )
}

const VideoComponent = ({ participantId }) => {
    console.warn("Participants Id ::: == >>>", participantId)
    const micRef = React.useRef(null);
    const { webcamStream, micStream, webcamOn, micOn } = useParticipant(
        participantId
    );

    const videoStream = React.useMemo(() => {
        if (webcamOn) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack([webcamStream.track]);
            console.log("webcamStream", webcamStream);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);

    React.useEffect(() => {
        if (micRef.current) {
            if (micOn) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack([micStream.track]);

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
        <Flex key={participantId} flex={'8'} justifyContent={'center'} alignItems={'center'} bg={'primary.200'} m={'5'}>
            {micOn && micRef && <audio ref={micRef} autoPlay />}
            {webcamOn ?
                <RTCView
                    objectFit="cover"
                    style={{ width: '100%', height: '100%' }}
                    streamURL={videoStream && videoStream.toURL()}
                />
                : null}
        </Flex>
    )
}

const Streaming = ({ meetingId, setFetchAgain, user }) => {
    const { dispatch, streamExists, selectedChat } = React.useContext(PhoneAppContext);
    const [joined, setJoined] = React.useState(false);
    const { join, participants } = useMeeting({});
    const participantsArrId = [...participants.keys()]; // Add this line
    console.warn("Participants ID Array ::: >>>", participantsArrId);

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
            console.warn(result, "result");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Flex flex={1} py={'1'} bg={'primary.100'}>
            {joined ?
                <>
                    {/* Name */}
                    <HStack flex={'2'} alignItems={'center'} justifyContent={'space-between'} my={'1'} mx={'5'}>
                        <VStack>
                            <Text>Group Name: {selectedChat?.chatName}</Text>
                            <Text>Host:</Text>
                        </VStack>
                        <HStack alignItems={'center'}>
                            <Icon mx={'1'} as={<MaterialIcons name="access-time" size={24} color="#3cc4b7" />} />

                            <Text>00:25:20</Text>
                        </HStack>
                    </HStack>
                    {/* Video  */}
                    {participantsArrId.map((participantId) => (
                        <VideoComponent participantId={participantId} />
                    ))}
                    {/* Controls */}
                    <Controls setFetchAgain={setFetchAgain} user={user} selectedChat={selectedChat} dispatch={dispatch} />
                </>
                :
                <Flex flex={'1'} justifyContent={'center'} alignItems={'center'} direction={'column'}>
                    <Text>
                        {!streamExists ?
                            'Create the meeting for the Others to join'
                            : 'Join the already going on meeting'
                        }
                    </Text>
                    <Button my={'3'} rounded={'lg'} bg={'primary.300'} onPress={joinMeeting}>
                        {!streamExists ?
                            'Create Meeting'
                            : 'Join Meeting'
                        }
                    </Button>
                </Flex>}
        </Flex>
    )
}

export default Streaming