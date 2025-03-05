const { Server } = require("socket.io");

let io = null;
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    },
  });

  return io;
};

const getSocket = () => {
  if (!io) {
    throw new Error("Socket is not initialized");
  }

  return io;
};

module.exports = { initializeSocket, getSocket };
