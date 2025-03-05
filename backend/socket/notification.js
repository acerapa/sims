const { getSocket } = require(".");

const startNotificationSocketNamespace = () => {
  const io = getSocket();
  io.of("/notification").on("connection", (socket) => {
    console.log("a user connected in notification");
  });
};

module.exports = { startNotificationSocketNamespace };
