import { Server } from 'socket.io';

let io: Server | null = null;
const activeUsers: Map<string, string> = new Map();

export const initSocket = (server: Server) => {
  io = server;
};

export const getIO = () => io;

export const setActiveUser = (userId: string, socketId: string) => {
  activeUsers.set(userId, socketId);
};

export const getSocketId = (userId: string) => {
  return activeUsers.get(userId);
};

export const removeActiveUser = (userId: string) => {
  activeUsers.delete(userId);
};

export const listActiveUsers = () => Array.from(activeUsers.keys());
