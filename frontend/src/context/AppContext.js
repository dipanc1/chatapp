import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
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
};

export const AppContext = createContext(INITIAL_STATE);

export const AppContextProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);
  useEffect(() => {
    const getUserInfo = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.get(`${backend_url}/users/user-info`, config)
        .then((res) => {
          dispatch({
            type: "GET_USER_INFO",
            payload: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUserInfo();
  }, [user.token])


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
        dispatch
      }}>
      {children}
    </AppContext.Provider>
  );
}; 