import React, { createContext, useReducer } from 'react';
import PhoneAppReducer from './PhoneAppReducer';

const INITIAL_STATE = {
  number: "",
  selectedChat: null,
  chats: [],
  notification: [],
  stream: false,
  fullScreen: true,
};

export const PhoneAppContext = createContext(INITIAL_STATE);

export const PhoneAppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PhoneAppReducer, INITIAL_STATE);

  return (
    <PhoneAppContext.Provider
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
    </PhoneAppContext.Provider>
  );
}; 