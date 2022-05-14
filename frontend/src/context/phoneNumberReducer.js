const PhoneNumberReducer = (state, action) => {
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
        case "SET_MOBILE":
            return {
                mobile: !state.mobile
            };
        default:
            return state;
    }
};

export default PhoneNumberReducer;