const User = require("../models/user");
const bcryptJS = require("bcryptjs");
const { UserSchema, UserSchemaUpdate } = require("../validator/User");

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
    const data = req.body;
    const { error } = UserSchema.validate(data);

    if (!error) {
      if (data.password) {
        data.password = await bcryptJS.hash(data.password, 10);
      }

      try {
        await User.create(data);
        res.sendResponse({}, "Successfully Registered!", 200);
      } catch (e) {
        let message =  "Something wen't wrong! => " + e.message;
        if (e.name == "SequelizeUniqueConstraintError") {
          message = "username must be unique!";
        }

				res.sendError(e, message, 400);
      }
    } else {
      res.sendError(error, "Something wen't wrong!", 400);
    }
  },

  update: async (req, res) => {
    let message = "Something wen't wrong!";

    const data = {};
    Object.keys(req.body).forEach((key) => {
      if (key != "id") {
        data[key] = req.body[key];
      }
    });

    const { error } = UserSchemaUpdate.validate(data);

    if (!error) {
      try {
        await User.update(data, { where: { id: req.body.id } });
        message = "Successfully updated!";
        res.sendResponse({}, message, 200);
      } catch (e) {
        res.sendError(e, message, 400);
      }
    } else {
      res.sendError(error, message, 400);
    }
  },

  delete: async (req, res) => {
    try {
      const user = await User.findByPk(req.body.user_id);
      if (user !== null) {
        await user.destroy();
				res.sendResponse({}, "Successfully deleted!", 200);
      } else {
				res.sendError({}, "User not found!", 404);
      }
    } catch (e) {
      res.sendError({}, "Something wen't wrong! => "+e.message, 400);
    }
  },
};
