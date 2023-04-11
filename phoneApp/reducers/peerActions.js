export const ADD_PEER_STREAM = "ADD_PEER_STREAM";
export const REMOVE_PEER_STREAM = "REMOVE_PEER_STREAM";
export const ADD_USER_ID = "ADD_USER_ID";

export const addPeerStreamAction = (peerId, stream) => ({
    type: ADD_PEER_STREAM,
    payload: { peerId, stream },
});

export const addUserIdAction = (peerId, userId) => ({
    type: ADD_USER_ID,
    payload: { peerId, userId },
});

export const removePeerStreamAction = (peerId) => ({
    type: REMOVE_PEER_STREAM,
    payload: { peerId },
});