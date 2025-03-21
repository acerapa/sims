const User = require("../models/user");
const bcryptJS = require("bcryptjs");

module.exports = {
  all: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        order: [["createdAt", "DESC"]],
      });

      res.sendResponse({ users }, "Successfully fetched!", 200);
    } catch (e) {
      res.sendError(e, "Something went wrong!", 400);
    }
  },

  register: async (req, res) => {
    let data = req.body.validated;
    if (data.password) {
      data.password = await bcryptJS.hash(data.password, 10);
    }

    try {
      const user = await User.create(data);
      res.sendResponse({ user }, "Successfully Registered!");
    } catch (e) {
      let message = "Something wen't wrong! => " + e.message;
      if (e.name == "SequelizeUniqueConstraintError") {
        message = "username must be unique!";
      }
      res.sendError(e, message, 400);
    }
  },

  update: async (req, res) => {
    const data = req.body.validated;
    try {
      await User.update(data, { where: { id: req.params.id } });
      res.sendResponse({}, "Successfully updated!", 200);
    } catch (e) {
      res.sendError(e, message, 400);
    }
  },

  destroy: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user !== null) {
        await user.destroy();
        res.sendResponse({}, "Successfully deleted!", 200);
      } else {
        res.sendError({}, "User not found!", 404);
      }
    } catch (e) {
      res.sendError({}, "Something wen't wrong! => " + e.message, 400);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: {
          exclude: ["password"],
        },
      });

      res.sendResponse({ user }, "Successfully fetched!", 200);
    } catch (error) {
      res.sendError(error, "Something wen't wrong!", 400);
    }
  },
};
