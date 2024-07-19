import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io("http://video-call-app-ccri.onrender.com:8000", {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  }), []);

  return (
    <SocketContext.Provider value={socket}>
      {props?.children}
    </SocketContext.Provider>
  );
};
