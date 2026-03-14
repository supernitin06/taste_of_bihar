// src/sockets/restaurantSocket.js
import { io } from "socket.io-client";

export const restaurantSocket = io(`${import.meta.env.VITE_SOCKET_URL}/restaurant`, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
