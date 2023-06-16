import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backend_url } from "../baseApi";
import AppReducer from "../reducers/AppReducer";

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

  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/join-group\/(.*)/);
  const matchLogin = location.pathname.match(/join-group\/(.*)\/login/);
  const matchRegister = location.pathname.match(/join-group\/(.*)\/register/);

  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

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
      await axios.get(`${backend_url}/users/user-info`, config)
        .then((res) => {
          dispatch({
            type: "SET_USER_INFO",
            payload: res.data,
          });
        })
        .catch((err) => {
          navigate("/");
          localStorage.removeItem("user");
        });
    };
    getUserInfo();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate, user?.token])


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
        dispatch
      }}>
      {children}
    </AppContext.Provider>
  );
}; 