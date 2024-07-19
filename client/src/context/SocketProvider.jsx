import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => {
    const newSocket = io("video-call-app-ccri.onrender.com:8000", {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected");
    });

    newSocket.on("disconnect", (reason) => {
      console.log(`WebSocket disconnected: ${reason}`);
    });

    newSocket.on("connect_error", (error) => {
      console.error(`WebSocket connection error: ${error}`);
    });

    return newSocket;
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {props?.children}
    </SocketContext.Provider>
  );
};
