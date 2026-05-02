import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const getBackendBase = () => {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return api.replace(/\/api\/?$/, '');
};

export const connectSocket = (token: string) => {
  if (socket && socket.connected) return socket;
  const backend = getBackendBase();
  socket = io(backend, {
    auth: { token },
    autoConnect: true,
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onEvent = (event: string, cb: (...args: any[]) => void) => {
  socket?.on(event, cb);
};

export const offEvent = (event: string, cb?: (...args: any[]) => void) => {
  if (cb) socket?.off(event, cb);
  else socket?.off(event as any);
};

export const emitEvent = (event: string, payload?: any) => {
  socket?.emit(event, payload);
};

export const getSocket = () => socket;
