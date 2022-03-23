const PhoneNumberReducer = (state, action) => {
    switch (action.type) {
        case "SET_NUMBER":
            return {
                ...state,
                number: action.payload
            };
        default:
            return state;
    }
};

export default PhoneNumberReducer;