// src/sockets/mainSocket.js
import { io } from "socket.io-client";

export const mainSocket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
