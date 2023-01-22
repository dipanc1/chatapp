import { createContext, useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router-dom";
import { v4 as uuidV4 } from 'uuid';
import Peer from 'peerjs';
import { peerReducer } from "./peerReducer";
import { ADD_PEER, REMOVE_PEER } from "./peerActions";

const ENDPOINT = "http://localhost:8080";

export const RoomContext = createContext(null);

const ws = socketIOClient(ENDPOINT);

export const RoomProvider = ({ children }) => {
    let history = useHistory();
    const [me, setMe] = useState();
    const [stream, setStream] = useState();
    const [peers, dispatch] = useReducer(peerReducer, {});
    const [screenSharingId, setScreenSharingId] = useState("");
    const [roomId, setRoomId] = useState("");

    const enterRoom = (roomId) => {
        console.warn("Room ID ::: >>>", roomId);
        history.push(`/room/${roomId}`);
    };

    const getUsers = ({ participants }) => {
        console.warn("Get Users ::: >>>", { participants });
    }

    const removePeer = (peerId) => {
        dispatch({
            type: REMOVE_PEER,
            payload: {
                peerId,
            }
        });
    }

    const shareScreen = () => {
        if (screenSharingId) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(switchScreen);
        } else {
            navigator.mediaDevices.getDisplayMedia({}).then(switchScreen);
        }
    }

    const switchScreen = (stream) => {
        setStream(stream);
        setScreenSharingId(screenSharingId ? "" : me?.id);

        Object.values(me?.connections).forEach((connection) => {
            const videoTrack = stream?.getTracks().find((track) => track.kind === "video");
            connection[0].peerConnection.getSenders()[1].replaceTrack(videoTrack).catch(err => console.error(err));

        });
    }

    useEffect(() => {
        // const savedId = localStorage.getItem("userId");
        // localStorage.setItem("userId", meId);
        const meId = uuidV4();

        const peer = new Peer(meId);

        setMe(peer);

        try {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                setStream(stream);
            });
        } catch (error) {
            console.error(error);

        }

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
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (screenSharingId) {
            ws.emit("start-sharing", { peerId: screenSharingId, roomId });
        } else {
            ws.emit("stop-sharing", roomId);
        }
    }, [screenSharingId, roomId]);


    useEffect(() => {
        if (!me) return;
        if (!stream) return;

        ws.on("user-joined", (peerId) => {
            console.warn("Peer Id :: >>", peerId);
            const call = me.call(peerId, stream);
            call.on("stream", (peerStream) => {
                dispatch({
                    type: ADD_PEER,
                    payload: {
                        peerId,
                        stream: peerStream
                    }
                });
            });
        });

        me.on("call", (call) => {
            console.warn("Call :: >>", call);
            call.answer(stream);
            call.on("stream", (peerStream) => {
                dispatch({
                    type: ADD_PEER,
                    payload: {
                        peerId: call.peer,
                        stream: peerStream
                    }
                });
            });
        });

    }, [me, stream])

    const startRecording = () => {
        const recordedChunks = [];
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (e) => {
            console.warn(e.data);
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
                console.log(recordedChunks);
                download();
            } else {
                console.log("Recording failed");
            }
        };

        recorder.start();

        const download = () => {
            const blob = new Blob(recordedChunks, {
                type: "video/mp4"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "test.mp4";
            a.click();
            window.URL.revokeObjectURL(url);
        };

        setTimeout(() => {
            console.log("stop");
            recorder.stop();
        }, 3000);
    };

    return (
        <RoomContext.Provider
            value={{
                ws,
                me,
                stream,
                peers,
                startRecording,
                shareScreen,
                screenSharingId,
                setRoomId,
            }}>
            {children}
        </RoomContext.Provider>
    );
}