import { createContext, useReducer } from "react";
import PhoneNumberReducer from "./phoneNumberReducer";

const INITIAL_STATE = {
  number: "",
  selectedChat: null,
  chats: [],
  notification: [],
  onlineUsers: null,
};

export const PhoneNumberContext = createContext(INITIAL_STATE);

export const PhoneNumberContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PhoneNumberReducer, INITIAL_STATE);

  return (
    <PhoneNumberContext.Provider
      value={{
        number: state.number,
        selectedChat: state.selectedChat,
        chats: state.chats,
        notification: state.notification,
        onlineUsers: state.onlineUsers,
        dispatch
      }}>
      {children}
    </PhoneNumberContext.Provider>
  );
}; 