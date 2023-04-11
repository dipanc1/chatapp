import { createContext, useEffect, useState, useReducer, useContext } from "react";
import socketIOClient from "socket.io-client";
import { v4 as uuidV4 } from 'uuid';
import { peerReducer } from "../reducers/peerReducer";
import { addUserIdAction, ADD_PEER_STREAM, REMOVE_PEER_STREAM } from "../reducers/peerActions";
// import useSound from 'use-sound';
// import joinSound from '../sounds/join.mp3';
// import leaveSound from '../sounds/leave.mp3';
import { PhoneAppContext } from "./PhoneAppContext";
import { mediaDevices } from "react-native-webrtc";

const ENDPOINT = "https://peerjs.wildcrypto.com";

export const RoomContext = createContext(null);

const ws = socketIOClient(ENDPOINT);

export const RoomProvider = ({ children, user }) => {
    // const [playJoin] = useSound(joinSound);
    // const [playLeave] = useSound(leaveSound);
    const [me, setMe] = useState();
    const [userId, setUserId] = useState(user?._id);
    const [streamState, setStreamState] = useState(null);
    const [peers, dispatch] = useReducer(peerReducer, {});
    const [screenSharingId, setScreenSharingId] = useState("");
    const [screenStream, setScreenStream] = useState();
    const [roomId, setRoomId] = useState("");
    const [participantsArray, setParticipantsArray] = useState([]);

    const { stream } = useContext(PhoneAppContext);

    // const enterRoom = (roomId) => {
    //     // console.warn("Room ID ::: >>>", roomId);
    //     localStorage.setItem("roomId", roomId);
    // };

    // const getUsers = ({ participants }) => {
    //     console.warn("Get Users ::: >>>", participants);
    //     // const participantsArray = Object.entries(participants).map(([peerId]) => ({ peerId }));
    //     // setParticipantsArray(participantsArray.map(x => x.peerId));
    // }

    // const removePeer = (peerId) => {
    //     console.warn("Remove Peer ::: >>>", peerId, "typeof peerId ::: >>>", typeof peerId);
    //     setParticipantsArray(participantsArray.filter((peerid) => peerid !== peerId));
    //     console.log("Participants Array ::: >>>", participantsArray);
    //     dispatch({
    //         type: REMOVE_PEER_STREAM,
    //         payload: {
    //             peerId,
    //         }
    //     });
    //     // playLeave();
    // }

    useEffect(() => {
        // const savedId = localStorage.getItem("userId");
        // const meId = savedId || uuidV4();

        // localStorage.setItem("userId", meId);

        // mediaDevices.getUserMedia({ audio: true, video: true }, function (stream) {
        //     stream.getTracks().forEach(x => x.stop());
        // }, err => console.log(err));

        const meId = uuidV4();
        // const peer = new Peer(meId);

        // setMe(peer);

        // ws.on("room-created", enterRoom);

        // ws.on("get-users", getUsers);

        // ws.on("user-disconnected", removePeer);

        // ws.on("user-shared-screen", (peerId) => setScreenSharingId(peerId));

        // ws.on("user-stopped-sharing", () => setScreenSharingId(""));

        // return () => {
        //     ws.off("room-created");
        //     ws.off("get-users");
        //     ws.off("user-disconnected");
        //     ws.off("user-started-sharing");
        //     ws.off("user-stopped-sharing");
        //     ws.off("user-joined");
        //     me?.disconnect();
        // }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const shareScreen = () => {
    //     if (screenSharingId) {
    //         mediaDevices.getUserMedia({ video: true, audio: true }).then(switchScreen);
    //     } else {
    //         mediaDevices.getDisplayMedia({}).then((stream) => {
    //             switchScreen(stream);
    //             setScreenStream(stream)
    //         })
    //     }
    // }

    // const switchScreen = (stream) => {
    //     // setStreamState(stream);
    //     setScreenSharingId(screenSharingId ? "" : me?.id);

    //     Object.values(me?.connections).forEach((connection) => {
    //         const videoTrack = stream?.getTracks().find((track) => track.kind === "video");
    //         connection[0].peerConnection.getSenders().find((sender) => sender.track.kind === "video").replaceTrack(videoTrack).catch(err => console.error(err));
    //     });
    // }


    // useEffect(() => {
    //     if (screenSharingId) {
    //         ws.emit("start-sharing", { peerId: screenSharingId, roomId });
    //     } else {
    //         ws.emit("stop-sharing", roomId);
    //     }
    // }, [screenSharingId, roomId]);

    useEffect(() => {
        try {
            mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                setStreamState(stream);
            });
        } catch (error) {
            console.error(error);
        }

    }, [])

    // useEffect(() => {
    //     if (!me) return;
    //     if (!streamState) return;

    //     ws.on("user-joined", ({ peerId, userId: userid }) => {
    //         // console.warn("User Joined ::: >>>", peerId, "typeof peerId ::: >>>", typeof peerId);
    //         setParticipantsArray([...participantsArray, peerId]);
    //         // console.log("Participants Array ::: >>>", participantsArray);
    //         dispatch(addUserIdAction(peerId, userid));
    //         // playJoin();
    //         const call = me.call(peerId, streamState, {
    //             metadata: {
    //                 userId,
    //             }
    //         });
    //         call.on("stream", (peerStream) => {
    //             dispatch({
    //                 type: ADD_PEER_STREAM,
    //                 payload: {
    //                     peerId,
    //                     stream: peerStream
    //                 }
    //             });
    //         });
    //     });

    //     me.on("call", (call) => {
    //         const userId = call.metadata.userId;
    //         dispatch(addUserIdAction(call.peer, userId))
    //         call.answer(streamState);
    //         call.on("stream", (peerStream) => {
    //             dispatch({
    //                 type: ADD_PEER_STREAM,
    //                 payload: {
    //                     peerId: call.peer,
    //                     stream: peerStream
    //                 }
    //             });
    //         });
    //     });

    //     return () => {
    //         ws.off("user-joined");
    //     };

    // }, [me, streamState, userId])

    // useEffect(() => {
    //     setUserId(user._id);
    // }, [userId])

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
            }}>
            {children}
        </RoomContext.Provider>
    );
}