'use client';
import React, { useEffect, useState } from 'react';
import initialSocket from '@/lib/socket';
import { useSession } from './SessionProvider';

const socketContext = React.createContext<typeof initialSocket | undefined>(
  undefined
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(initialSocket);
  const [session] = useSession();

  useEffect(() => {
    if (session) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [session, socket]);

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = React.useContext(socketContext);

  if (!ctx) {
    throw new Error('Cannot use useSocket outisde of SocketProvider');
  }

  return ctx;
};
