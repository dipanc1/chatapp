import { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const INITIAL_STATE = {
  number: "",
  selectedChat: null,
  chats: [],
  notification: [],
  stream: false,
  fullScreen: true,
};

export const AppContext = createContext(INITIAL_STATE);

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

  return (
    <AppContext.Provider
      value={{
        number: state.number,
        selectedChat: state.selectedChat,
        chats: state.chats,
        notification: state.notification,
        stream: state.stream,
        fullScreen: state.fullScreen,
        dispatch
      }}>
      {children}
    </AppContext.Provider>
  );
}; 