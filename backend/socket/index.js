const { Server } = require("socket.io");

let io = null;
const initializeSocket = (server) => {
  console.log("Initializing socket...");
  io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_ALLOWED_ORIGIN,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    },
  });
  console.log("Socket initialized");

  return io;
};

const getSocket = () => {
  if (!io) {
    throw new Error("Socket is not initialized");
  }

  return io;
};

module.exports = { initializeSocket, getSocket };
