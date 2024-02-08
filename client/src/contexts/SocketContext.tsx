import { createContext, useContext, FC, ReactNode } from 'react';
import { API_URL } from '../utils/constants';
import io, { Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const socket = io(`${API_URL}`);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
