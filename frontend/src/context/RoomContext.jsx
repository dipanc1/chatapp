import { createContext, useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import { v4 as uuidV4 } from 'uuid';
import Peer from 'peerjs';
import { peerReducer } from "./peerReducer";
import { ADD_PEER, REMOVE_PEER } from "./peerActions";
import { useContext } from "react";
import { AppContext } from "./AppContext";
import useSound from 'use-sound';
import joinSound from '../sounds/join.mp3';
import leaveSound from '../sounds/leave.mp3';

const ENDPOINT = "http://localhost:8080";
// const ENDPOINT = "https://peerjs.wildcrypto.com";
// const ENDPOINT = "https://chatappeerserver.azurewebsites.net";

export const RoomContext = createContext(null);


const ws = socketIOClient(ENDPOINT);

export const RoomProvider = ({ children }) => {
    const [playJoin] = useSound(joinSound);
    const [playLeave] = useSound(leaveSound);
    const [me, setMe] = useState();
    const [streamState, setStreamState] = useState(null);
    const [peers, dispatch] = useReducer(peerReducer, {});
    const [screenSharingId, setScreenSharingId] = useState("");
    const [roomId, setRoomId] = useState("");

    const { stream } = useContext(AppContext);

    const enterRoom = (roomId) => {
        console.warn("Room ID ::: >>>", roomId);
        localStorage.setItem("roomId", roomId);
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
        playLeave();
    }

    useEffect(() => {
        // const savedId = localStorage.getItem("userId");
        // const meId = savedId || uuidV4();

        // localStorage.setItem("userId", meId);

        navigator.getUserMedia({ audio: true, video: true }, function (stream) {
            stream.getTracks().forEach(x => x.stop());
        }, err => console.log(err));

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
        }

    }, []);

    const shareScreen = () => {
        if (screenSharingId) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(switchScreen);
        } else {
            navigator.mediaDevices.getDisplayMedia({}).then(switchScreen);
        }
    }

    const switchScreen = (stream) => {
        setStreamState(stream);
        setScreenSharingId(screenSharingId ? "" : me?.id);

        Object.values(me?.connections).forEach((connection) => {
            const videoTrack = stream?.getTracks().find((track) => track.kind === "video");
            connection[0].peerConnection.getSenders()[1].replaceTrack(videoTrack).catch(err => console.error(err));
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
            });
        } catch (error) {
            console.error(error);
        }

    }, [stream])

    useEffect(() => {
        if (!me) return;
        if (!streamState) return;

        ws.on("user-joined", (peerId) => {
            console.warn("Peer Id :: >>", peerId);
            playJoin();
            const call = me.call(peerId, streamState);
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
            call.answer(streamState);
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

    }, [me, streamState])


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
            }}>
            {children}
        </RoomContext.Provider>
    );
}