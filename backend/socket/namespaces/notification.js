let notificationNamespace;

const startNotificationSocketNamespace = (io) => {
  if (notificationNamespace) {
    throw new Error("Notification socket is already initialized");
  }

  notificationNamespace = io.of("/notification");

  notificationNamespace.on("connection", (socket) => {
    console.log("a user connected in notification");
  });
};

const getNotificationSocket = () => {
  if (!notificationNamespace) {
    throw new Error("Notification socket is not initialized");
  }

  return notificationNamespace;
};

module.exports = { startNotificationSocketNamespace, getNotificationSocket };
