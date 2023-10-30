const AppReducer = (state, action) => {
    switch (action.type) {
        case "SET_NUMBER":
            return {
                ...state,
                number: action.payload
            };
        case "SET_SELECTED_CHAT":
            return {
                ...state,
                selectedChat: action.payload
            };
        case "SET_CHATS":
            return {
                ...state,
                chats: action.payload
            };
        case "SET_NOTIFICATION":
            return {
                ...state,
                notification: action.payload
            };
        case "SET_STREAM":
            return {
                ...state,
                stream: !state.stream
            };
        case "SET_FULLSCREEN":
            return {
                ...state,
                fullScreen: !state.fullScreen
            };
        case "SET_CONVERSATIONS":
            return {
                ...state,
                conversations: action.payload
            };
        case "SET_GROUP_CONVERSATIONS":
            return {
                ...state,
                groupConversations: action.payload
            };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload
            };
        case "SET_USER_INFO":
            return {
                ...state,
                userInfo: action.payload
            };
        case "SET_PUSH_NOTIFICATION":
            return {
                ...state,
                pushNotification: !state.pushNotification
            };
        case "SET_EVENT_INFO":
            return {
                ...state,
                eventInfo: action.payload
            };
        case "SET_FETCH_GROUP_DONATIONS":
            return {
                ...state,
                fetchGroupDonations: !state.fetchGroupDonations
            };
        default:
            return state;
    }
};

export default AppReducer;