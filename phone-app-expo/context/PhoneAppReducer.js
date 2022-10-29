const PhoneAppReducer = (state, action) => {
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
        case "SET_USER":
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
};

export default PhoneAppReducer;