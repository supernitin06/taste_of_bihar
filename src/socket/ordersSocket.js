// src/sockets/ordersSocket.js
import { io } from "socket.io-client";

export const ordersSocket = io(`${import.meta.env.VITE_SOCKET_URL}/orders`, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
