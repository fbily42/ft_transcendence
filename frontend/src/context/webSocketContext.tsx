import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

const WebSocketContext = createContext<Socket | null>(null);

export const useWebSocket = () => useContext(WebSocketContext);


export const WebSocketProvider: React.FC = () => {
  const [webSocket, setWebSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const ws: Socket = io(`${import.meta.env.VITE_WSCHAT_URL}`,{
		withCredentials: true,
	});
    setWebSocket(ws);

    return () => {
		if (ws) {
			ws.close();
		}
	};
  }, []);

  return (
    <WebSocketContext.Provider value={webSocket}>
      <Outlet />
    </WebSocketContext.Provider>
  );
};
