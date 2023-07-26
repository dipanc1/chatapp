import React from 'react'
import { Button, Flex, HStack, Icon, IconButton, VStack, Text } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import { RTCView, useMeeting, useParticipant } from '@videosdk.live/react-native-sdk'
import axios from 'axios'
import { backend_url } from '../../production'

function Controls({ fetchAgain, setFetchAgain, user, admin }) {

    const { dispatch, selectedChat } = React.useContext(PhoneAppContext);

    const [micOn, setMicOn] = React.useState(true);
    const [webcamOn, setWebcamOn] = React.useState(false);
    const [flipWebcam, setFlipWebcam] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [startRecordingState, setStartRecordingState] = React.useState(false);
    const [fullscreenOn, setFullscreenOn] = React.useState(false);

    const { leave, toggleMic, toggleWebcam, getWebcams, changeWebcam, end, startRecording, stopRecording } = useMeeting();

    let webcams;

    const micToggle = () => {
        setMicOn(!micOn);
        toggleMic();
    }

    const webcamToggle = () => {
        setWebcamOn(!webcamOn);
        toggleWebcam();
    }

    React.useEffect(() => {
        const handleGetWebcams = async () => {
            webcams = await getWebcams();
            // console.warn("Webcams", webcams);
            return webcams;
        }
        handleGetWebcams();
    })

    const handleChangeWebcam = () => {
        if (webcams) {
            const { deviceId } = webcams[!flipWebcam ? 1 : 0];
            // console.warn("Device ID ", deviceId);
            changeWebcam(deviceId);
            setFlipWebcam(!flipWebcam);
        }
        else {
            alert("No other webcam available");
        }
    };

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
                dispatch({ type: "SET_STREAM" });
                setFetchAgain(!fetchAgain)
            } else {
                console.log("error");
            }

        } catch (error) {
            console.log(error);
        }
    }

    const leaveStream = () => {
        leave();
        dispatch({ type: "SET_STREAM" });
        setFetchAgain(!fetchAgain)
    }

    const recordingStart = () => {
        startRecording();
        setStartRecordingState(true);
    }

    const recordingStop = () => {
        stopRecording();
        setStartRecordingState(false);
    }

    const fullscreenToggle = () => {
        setFullscreenOn(!fullscreenOn);
        dispatch({ type: "SET_FULLSCREEN" });
    }

    return (
        <HStack flex={'3'} mx={'2'} justifyContent={'space-between'}>

            {admin && <Flex justifyContent={'center'} alignItems={'center'}>
                <IconButton disabled={loading} onPress={webcamToggle} bg={'primary.200'} icon={<MaterialIcons name={webcamOn ? "videocam" : "videocam-off"} size={24} color="#9F85F7" />} />
                <Text>{webcamOn ? 'Camera On' : 'Camera Off'}</Text>
            </Flex>}

            {admin && <Flex justifyContent={'center'} alignItems={'center'}>
                <IconButton disabled={loading} onPress={handleChangeWebcam} bg={'primary.200'} icon={<MaterialIcons name={flipWebcam ? "camera-rear" : "camera-front"} size={24} color="#9F85F7" />} />
                <Text>{flipWebcam ? 'Rear Camera' : 'Front Camera'}</Text>
            </Flex>}

            {admin ? <Flex justifyContent={'center'} alignItems={'center'}>
                <IconButton disabled={loading} onPress={() => micToggle()} bg={'primary.200'} icon={<MaterialIcons name={micOn ? "mic" : "mic-off"} size={24} color="#EFAA86" />} />
                <Text>{micOn ? 'Unmute' : 'Mute'}</Text>
            </Flex>
                :
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <IconButton disabled={loading} onPress={fullscreenToggle} bg={'primary.200'} icon={<MaterialIcons name={fullscreenOn ? 'fullscreen' : 'fullscreen-exit'} size={24} color="#EFAA86" />} />
                    <Text> {fullscreenOn ? 'Full Screen' : 'Fit Screen'}</Text>
                </Flex>}

            <Flex justifyContent={'center'} alignItems={'center'}>
                <IconButton disabled={loading} onPress={admin ? endStream : leaveStream} bg={'primary.200'} icon={<MaterialIcons name="cancel-presentation" size={24} color="#ff4343" />} />
                <Text>
                    {admin ? 'End' : 'Leave'}
                </Text>
            </Flex>

            {admin &&
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <IconButton disabled={loading} onPress={startRecordingState ? recordingStop : recordingStart} bg={'primary.200'} icon={<MaterialIcons name={startRecordingState ? "voice-over-off" : "record-voice-over"} size={24} color="#EFAA86" />} />
                    <Text>
                        {startRecordingState ? 'Stop Recording' : 'Start Recording'}
                    </Text>
                </Flex>
            }
        </HStack>
    )
}

const VideoComponent = ({ participantId }) => {
    // console.warn("Participants Id ::: == >>>", participantId)
    const { webcamStream, webcamOn } = useParticipant(
        participantId
    );

    return (
        webcamOn ?
            <Flex key={participantId} flex={'8'} justifyContent={'center'} alignItems={'center'} bg={'primary.200'} m={'5'}>
                {webcamOn && webcamStream &&
                    <RTCView
                        objectFit="cover"
                        style={{ width: '100%', height: '100%' }}
                        streamURL={new MediaStream([webcamStream?.track]).toURL()}
                    />
                }
            </Flex>
            :
            <></>
    )
}

const Streaming = ({ meetingId, fetchAgain, setFetchAgain, user, admin }) => {

    const { dispatch, selectedChat } = React.useContext(PhoneAppContext);

    const [joined, setJoined] = React.useState(false);
    const [meetingIdExists, setMeetingIdExists] = React.useState(false);

    const { join, participants } = useMeeting({});

    const participantsArrId = [...participants.keys()];

    // console.warn("Participants ID Array ::: >>>", participantsArrId);

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
            // console.warn(result, "result");

        } catch (error) {
            console.log("Error", error);
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
        <Flex flex={1} py={'1'} bg={'primary.100'}>
            {joined ?
                <>
                    {/* Name */}
                    <HStack flex={'2'} alignItems={'center'} justifyContent={'space-between'} my={'1'} mx={'5'}>
                        <VStack>
                            <Text>Group Name: {selectedChat?.chatName.toUpperCase()}</Text>
                            <Text>Host: {selectedChat?.groupAdmin?.username}</Text>
                        </VStack>
                    </HStack>

                    {/* Video  */}
                    {participantsArrId.map((participantId) => (
                        <VideoComponent participantId={participantId} />
                    ))}

                    {/* Controls */}
                    <Controls admin={admin} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} user={user} selectedChat={selectedChat} dispatch={dispatch} />
                </>
                :
                <Flex flex={'1'} justifyContent={'center'} alignItems={'center'} direction={'column'}>
                    <Text>
                        {!meetingIdExists ? 'Create the meeting for the Others to join' : 'Join the already going on meeting'}
                    </Text>
                    <Button my={'3'} rounded={'lg'} bg={'primary.300'} onPress={joinMeeting}>
                        {!meetingIdExists ? 'Create Meeting' : 'Join Meeting'}
                    </Button>
                </Flex>}
        </Flex>
    )
}

export default Streaming