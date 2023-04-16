import React from "react";
import Peer from 'react-native-peerjs';
import socketIOClient from "socket.io-client";
import uuid from 'react-native-uuid';
import { peerReducer } from "../reducers/peerReducer";
import { addUserIdAction, ADD_PEER_STREAM, REMOVE_PEER_STREAM } from "../reducers/peerActions";
// import useSound from 'use-sound';
// import joinSound from '../sounds/join.mp3';
// import leaveSound from '../sounds/leave.mp3';
import { PhoneAppContext } from "./PhoneAppContext";
import { mediaDevices } from "react-native-webrtc";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ENDPOINT = "https://peerjs.wildcrypto.com";

export const RoomContext = React.createContext(null);

const ws = socketIOClient(ENDPOINT);

export const RoomProvider = ({ children, user }) => {
    // const [playJoin] = useSound(joinSound);
    // const [playLeave] = useSound(leaveSound);
    const [me, setMe] = React.useState();
    const [userId, setUserId] = React.useState(user?._id);
    const [streamState, setStreamState] = React.useState(null);
    const [peers, dispatch] = React.useReducer(peerReducer, {});
    const [screenSharingId, setScreenSharingId] = React.useState("");
    const [screenStream, setScreenStream] = React.useState();
    const [roomId, setRoomId] = React.useState("");
    const [participantsArray, setParticipantsArray] = React.useState([]);

    const { stream } = React.useContext(PhoneAppContext);

    const enterRoom = async (roomId) => {
        console.warn("Room ID ::: >>>", roomId);
        await AsyncStorage.setItem('roomId', roomId)
    };

    const getUsers = ({ participants }) => {
        console.warn("Get Users ::: >>>", participants);
    }

    const removePeer = (peerId) => {
        console.warn("Remove Peer ::: >>>", peerId, "typeof peerId ::: >>>", typeof peerId);
        setParticipantsArray(participantsArray.filter((peerid) => peerid !== peerId));
        console.log("Participants Array ::: >>>", participantsArray);
        dispatch({
            type: REMOVE_PEER_STREAM,
            payload: {
                peerId,
            }
        });
        // playLeave();
    }

    let isVoiceOnly = false;
    let cameraCount = 0;
    let localMediaStream;
    React.useEffect(() => {
        // mediaDevices.getUserMedia({ audio: true, video: true }, function (stream) {
        //     stream.getTracks().forEach(x => x.stop());
        // }, err => console.log(err));


        const cameraCounts = async () => {

            try {
                const devices = await mediaDevices.enumerateDevices();

                devices.map(device => {
                    if (device.kind != 'videoinput') { return; };

                    cameraCount = cameraCount + 1;
                });
            } catch (err) {
                // Handle Error
                console.log(err)
            };
        };

        cameraCounts();

        let mediaConstraints = {
            audio: true,
            video: {
                frameRate: 30,
                facingMode: 'user'
            }
        };

        const mediaStreams = async () => {

            try {
                const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

                if (isVoiceOnly) {
                    let videoTrack = mediaStream.getVideoTracks()[0];
                    videoTrack.enabled = false;
                };

                // localMediaStream = mediaStream;
                setStreamState(mediaStream);
            } catch (err) {
                // Handle Error
                console.log(err)
            };
        };

        mediaStreams();

        const meId = uuid.v4();
        const peer = new Peer(meId);

        setMe(peer);

        ws.on("room-created", enterRoom);

        ws.on("get-users", getUsers);

        ws.on("user-disconnected", removePeer);

        ws.on("user-shared-screen", (peerId) => setScreenSharingId(peerId));

        ws.on("user-stopped-sharing", () => setScreenSharingId(""));

        return () => {
            ws.off("room-created");
            ws.off("get-users");
            ws.off("user-disconnected");
            ws.off("user-started-sharing");
            ws.off("user-stopped-sharing");
            ws.off("user-joined");
            me?.disconnect();
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shareScreen = () => {
        if (screenSharingId) {
            mediaDevices.getUserMedia({ video: true, audio: true }).then(switchScreen);
        } else {
            mediaDevices.getDisplayMedia({}).then((stream) => {
                switchScreen(stream);
                setScreenStream(stream)
            })
        }
    }

    const switchScreen = (stream) => {
        setScreenSharingId(screenSharingId ? "" : me?.id);

        Object.values(me?.connections).forEach((connection) => {
            const videoTrack = stream?.getTracks().find((track) => track.kind === "video");
            connection[0].peerConnection.getSenders().find((sender) => sender.track.kind === "video").replaceTrack(videoTrack).catch(err => console.error(err));
        });
    }


    React.useEffect(() => {
        if (screenSharingId) {
            ws.emit("start-sharing", { peerId: screenSharingId, roomId });
        } else {
            ws.emit("stop-sharing", roomId);
        }
    }, [screenSharingId, roomId]);

    // useEffect(() => {
    //     try {
    //         mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    //             setStreamState(stream);
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }

    // }, [])

    React.useEffect(() => {
        if (!me) return;
        if (!streamState) return;

        ws.on("user-joined", ({ peerId, userId: userid }) => {
            // console.warn("User Joined ::: >>>", peerId, "typeof peerId ::: >>>", typeof peerId);
            setParticipantsArray([...participantsArray, peerId]);
            // console.log("Participants Array ::: >>>", participantsArray);
            dispatch(addUserIdAction(peerId, userid));
            // playJoin();
            const call = me.call(peerId, streamState, {
                metadata: {
                    userId,
                }
            });
            call.on("stream", (peerStream) => {
                dispatch({
                    type: ADD_PEER_STREAM,
                    payload: {
                        peerId,
                        stream: peerStream
                    }
                });
            });
        });

        me.on("call", (call) => {
            const userId = call.metadata.userId;
            dispatch(addUserIdAction(call.peer, userId))
            call.answer(streamState);
            call.on("stream", (peerStream) => {
                dispatch({
                    type: ADD_PEER_STREAM,
                    payload: {
                        peerId: call.peer,
                        stream: peerStream
                    }
                });
            });
        });

        return () => {
            ws.off("user-joined");
        };

    }, [me, streamState, userId])

    React.useEffect(() => {
        setUserId(user._id);
    }, [userId])

    return (
        <RoomContext.Provider
            value={{
                ws,
                me,
                streamState,
                peers,
                shareScreen,
                screenSharingId,
                setRoomId,
                userId,
                setUserId,
                screenStream,
                participantsArray,
                localMediaStream,
            }}>
            {children}
        </RoomContext.Provider>
    );
}