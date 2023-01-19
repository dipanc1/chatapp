import { ADD_PEER, ADD_PEER_NAME, REMOVE_PEER } from "./peerActions";

export const peerReducer = (state, action) => {
    switch (action.type) {
        case ADD_PEER:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    stream: action.payload.stream
                },
            };
        case ADD_PEER_NAME:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    username: action.payload.username,
                },
            };
        case REMOVE_PEER:
            const { [action.payload.peerId]: deleted, ...rest } = state;
            return rest;
        default:
            return { ...state };
    }
};