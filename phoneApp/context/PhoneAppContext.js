import React, { createContext, useEffect, useReducer } from 'react';
import AppReducer from '../reducers/AppReducer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backend_url } from '../utils';
import axios from 'axios';
import { useNavigationContainerRef } from '@react-navigation/native';

const INITIAL_STATE = {
  number: "",
  selectedChat: null,
  notification: [],
  stream: false,
  fullScreen: true,
  userInfo: null,
};

export const PhoneAppContext = createContext(INITIAL_STATE);

export const PhoneAppContextProvider = ({ children, user, fetchAgain, setFetchAgain }) => {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

  const [signature, setSignature] = React.useState("");
  const [timestamp, setTimestamp] = React.useState("");

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
          setFetchAgain(!fetchAgain)
        });
    };
    getUserInfo();
  }, [user?.token])

  const getCloudinarySignature = async () => {
    try {
      const res = await axios.get(`${backend_url}/upload`);
      setSignature(res.data.signature);
      setTimestamp(res.data.timestamp);
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <PhoneAppContext.Provider
      value={{
        number: state.number,
        selectedChat: state.selectedChat,
        notification: state.notification,
        stream: state.stream,
        fullScreen: state.fullScreen,
        userInfo: state.userInfo,
        signature: signature,
        timestamp: timestamp,
        getCloudinarySignature,
        dispatch
      }}>
      {children}
    </PhoneAppContext.Provider>
  );
}; 