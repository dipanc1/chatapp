import { createContext, useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import { v4 as uuidV4 } from 'uuid';
import Peer from 'peerjs';
import { peerReducer } from "../reducers/peerReducer";
import { addUserIdAction, ADD_PEER_STREAM, REMOVE_PEER_STREAM } from "../reducers/peerActions";
import { useContext } from "react";
import { AppContext } from "./AppContext";
import useSound from 'use-sound';
import joinSound from '../sounds/join.mp3';
import leaveSound from '../sounds/leave.mp3';
import { peer_server_url } from "../utils";

const ENDPOINT = peer_server_url;

export const RoomContext = createContext(null);

const ws = socketIOClient(ENDPOINT);

export const RoomProvider = ({ children }) => {
    const { stream, userInfo } = useContext(AppContext);

    const [peers, dispatch] = useReducer(peerReducer, {});

    const [playJoin] = useSound(joinSound);
    const [playLeave] = useSound(leaveSound);

    const [me, setMe] = useState();
    const [userId, setUserId] = useState(userInfo?._id);
    const [streamState, setStreamState] = useState(null);
    const [screenSharingId, setScreenSharingId] = useState("");
    const [screenStream, setScreenStream] = useState();
    const [roomId, setRoomId] = useState("");
    const [participantsArray, setParticipantsArray] = useState([]);
    const [cameraPermission, setCameraPermission] = useState(true);


    const enterRoom = (roomId) => {
        localStorage.setItem("roomId", roomId);
    };

    const getUsers = ({ participants }) => { }

    const removePeer = (peerId) => {
        setParticipantsArray(participantsArray.filter((peerid) => peerid !== peerId));
        dispatch({
            type: REMOVE_PEER_STREAM,
            payload: {
                peerId,
            }
        });
        playLeave();
    }

    useEffect(() => {
        // const savedId = localStorage.getItem("userId");
        // const meId = savedId || uuidV4();

        // localStorage.setItem("userId", meId);

        navigator.getUserMedia({ audio: true, video: true }, function (stream) {
            stream.getTracks().forEach(x => x.stop());
        }, (err) => {
            console.error(err);
            setCameraPermission(false);
        });

        const meId = uuidV4();
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
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(switchScreen).catch((err) => {
                console.error(err);
            });
        } else {
            navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
                switchScreen(stream);
                setScreenStream(stream)
            }).catch((err) => {
                console.error(err);
            });
        }
    }

    const switchScreen = (stream) => {
        setScreenSharingId(screenSharingId ? "" : me?.id);

        Object.values(me?.connections).forEach((connection) => {
            const videoTrack = stream?.getTracks().find((track) => track.kind === "video");
            connection[0].peerConnection.getSenders().find((sender) => sender.track.kind === "video").replaceTrack(videoTrack).catch((err) => {
                console.error(err);
                setCameraPermission(false);
            });
        });
    }

    useEffect(() => {
        if (screenSharingId) {
            ws.emit("start-sharing", { peerId: screenSharingId, roomId });
        } else {
            ws.emit("stop-sharing", roomId);
        }
    }, [screenSharingId, roomId]);

    useEffect(() => {
        try {
            navigator.mediaDevices.getUserMedia({ video: stream, audio: stream }).then((stream) => {
                setStreamState(stream);
            }).catch((err) => {
                console.error(err);
                if (err.name === "NotAllowedError") {
                    setCameraPermission(false);
                }
            });
        } catch (error) {
            console.error(error);
            setCameraPermission(false);
        }

    }, [stream])

    useEffect(() => {
        if (!me) return;
        if (!streamState) return;

        ws.on("user-joined", ({ peerId, userId: userid }) => {
            setParticipantsArray([...participantsArray, peerId]);
            dispatch(addUserIdAction(peerId, userid));
            playJoin();
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [me, playJoin, streamState, userId])

    useEffect(() => {
        if (userInfo?._id) {
            setUserId(userInfo._id);
        }
    }, [userId, userInfo?._id])

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
                cameraPermission
            }}>
            {children}
        </RoomContext.Provider>
    );
}