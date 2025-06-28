import React, { createContext, useEffect, useContext } from "react";
import { io } from "socket.io-client";

// Create context for socket
export const SocketContext = createContext();

// Singleton socket instance
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
  transports: ["websocket"],
});

const SocketProvider = ({ children }) => {
  useEffect(() => {
   console.log("working")
    socket.on("connect", () => {
      console.log("Connected to server with socket ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Cleanup on component unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const sendMessage = (eventName, message) => {
    socket.emit(eventName, message);
  };

  const receiveMessage = (eventName, callback) => {
    socket.on(eventName, callback);
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage, receiveMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

// Custom hook to use the socket context easily
export const useSocket = () => useContext(SocketContext);
