const Notification = require("../models/notification");
const { getNotificationSocket } = require("../socket/namespaces/notification");

module.exports = {
  testNotification: async (req, res) => {
    const notification = await Notification.create({
      title: `Notification Testing`,
      description: "Please ignore this nottification",
    });

    const notificationSocket = getNotificationSocket();
    notificationSocket.emit("new-notification", notification);

    res.sendResponse(
      { notification },
      "Notification created successfully",
      200
    );
  },
};
