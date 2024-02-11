import {
    ADD_PEER_STREAM,
    ADD_USER_ID,
    REMOVE_PEER_STREAM,
} from './peerActions';

export const peerReducer = (state, action) => {
    switch (action.type) {
        case ADD_PEER_STREAM:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    stream: action.payload.stream,
                },
            };
        case ADD_USER_ID:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    userId: action.payload.userId,
                },
            };
        case REMOVE_PEER_STREAM:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    stream: undefined,
                },
            };
        default:
            return { ...state };
    }
};
