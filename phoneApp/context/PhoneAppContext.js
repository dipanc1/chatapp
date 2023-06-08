import React, { createContext, useEffect, useReducer } from 'react';
import AppReducer from '../reducers/AppReducer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backend_url } from '../production';
import axios from 'axios';

const INITIAL_STATE = {
  number: "",
  selectedChat: null,
  chats: [],
  notification: [],
  stream: false,
  fullScreen: true,
  userInfo: null,
};

export const PhoneAppContext = createContext(INITIAL_STATE);

export const PhoneAppContextProvider = ({ children, user }) => {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!user) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.get(`${backend_url}/users/user-info`, config)
        .then((res) => {
          dispatch({
            type: "SET_USER_INFO",
            payload: res.data,
          });
        })
        .catch((err) => {
          AsyncStorage.removeItem('user')
        });
    };
    getUserInfo();
  }, [user?.token])

  return (
    <PhoneAppContext.Provider
      value={{
        number: state.number,
        selectedChat: state.selectedChat,
        chats: state.chats,
        notification: state.notification,
        stream: state.stream,
        fullScreen: state.fullScreen,
        userInfo: state.userInfo,
        dispatch
      }}>
      {children}
    </PhoneAppContext.Provider>
  );
}; 