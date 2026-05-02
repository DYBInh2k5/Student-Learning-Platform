import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      transports: ['websocket'],
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('connect_error', () => setIsConnected(false));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, isConnected };
};
