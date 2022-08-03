import React from "react";
import { io } from "socket.io-client";
import { backend_url } from "../production";

const ENDPOINT = `${backend_url}`;
const user = JSON.parse(localStorage.getItem("user"));

var socket = io(ENDPOINT);
socket.emit("setup", user);
// user online
socket.emit("user-online", user);
// console.warn("NJKFDWJNFJWN",socket.emit("setup", user));
export const SocketContext = React.createContext(socket);

export const SocketContextProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}