import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backend_url } from "../utils";
import AppReducer from "../reducers/AppReducer";
import { useToast } from "@chakra-ui/react";


const INITIAL_STATE = {
  number: "",
  selectedChat: null,
  chats: [],
  notification: [],
  stream: false,
  fullScreen: true,
  conversations: [],
  groupConversations: [],
  loading: false,
  userInfo: null,
  pushNotification: true,
  eventInfo: null,
};

export const AppContext = createContext(INITIAL_STATE);

export const AppContextProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const toast = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/join-group\/(.*)/);
  const matchLogin = location.pathname.match(/join-group\/(.*)\/login/);
  const matchRegister = location.pathname.match(/join-group\/(.*)\/register/);

  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);
  const [signature, setSignature] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const axiosJwt = axios.create({
    baseURL: backend_url,
  });

  useEffect(() => {
    const getUserInfo = async () => {
      if (location.pathname === "/register" || location.pathname === "/" || matchRegister || matchLogin || match) {
        return;
      }
      if (!user) {
        navigate("/");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axiosJwt.get(`/users/user-info`, config)
        .then((res) => {
          dispatch({
            type: "SET_USER_INFO",
            payload: res.data,
          });
          if ((location.pathname === "/" || location.pathname === "/video-chat" || location.pathname === "/groups" || location.pathname === "/settings") && res.data?.isSuperAdmin) {
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: "Please login again",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate("/");
          localStorage.removeItem("user");
        });
    };
    getUserInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate, user?.token])

  const getCloudinarySignature = async () => {
    try {
      const res = await axiosJwt.get(`/upload`);

      setSignature(res.data.signature);
      setTimestamp(res.data.timestamp);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error getting image server",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

  };


  return (
    <AppContext.Provider
      value={{
        number: state.number,
        selectedChat: state.selectedChat,
        chats: state.chats,
        notification: state.notification,
        stream: state.stream,
        fullScreen: state.fullScreen,
        conversations: state.conversations,
        groupConversations: state.groupConversations,
        loading: state.loading,
        userInfo: state.userInfo,
        pushNotification: state.pushNotification,
        eventInfo: state.eventInfo,
        signature: signature,
        timestamp: timestamp,
        getCloudinarySignature,
        dispatch
      }}>
      {children}
    </AppContext.Provider>
  );
}; 