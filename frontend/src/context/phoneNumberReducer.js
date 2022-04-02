const PhoneNumberReducer = (state, action) => {
    switch (action.type) {
        case "SET_NUMBER":
            return {
                ...state,
                number: action.payload
            };
        case "SET_CURRENT_CHAT":
            return {
                ...state,
                currentChat: action.payload
            };
        default:
            return state;
    }
};

export default PhoneNumberReducer;