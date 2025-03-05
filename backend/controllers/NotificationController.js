const Notification = require("../models/notification");

module.exports = {
  all: async (req, res) => {
    try {
      const notifications = await Notification.findAll();
      res.sendResponse(
        { notifications },
        "Notification fetched successfully",
        200
      );
    } catch (error) {
      res.sendError(error, "Error fetching notifications", 500);
    }
  },

  register: async (req, res) => {
    try {
      const data = req.body.valodated;
      const notification = await Notification.create(data);

      res.sendResponse(
        { notification },
        "Notification created successfully",
        200
      );
    } catch (error) {
      res.sendError(error, "Something went wrong!", 500);
    }
  },

  update: async (req, res) => {
    try {
      await Notification.update(req.body.validated, {
        where: { id: req.params.id },
      });

      const notification = await Notification.findByPk(req.params.id);
      res.sendResponse(
        { notification },
        "Notification updated successfully",
        200
      );
    } catch (error) {
      res.sendError(error, "Something went wrong!", 500);
    }
  },
};
