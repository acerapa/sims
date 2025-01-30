const Account = require("../models/account");
const { AccountSchema } = require("shared");

module.exports = {
  all: async (req, res) => {
    try {
      const accounts = await Account.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.sendResponse({ accounts }, "Successfully fetched!", 200);
    } catch (e) {
      res.sendError(e, "Somethinfg wen't wrong! => " + e.message, 400);
    }
  },

  register: async (req, res) => {
    const { error } = AccountSchema.validate(req.body);
    if (!error) {
      try {
        const account = await Account.create(req.body);
        res.sendResponse({ account }, "Successfully created!", 200);
      } catch (e) {
        res.sendError(e, "Something wen't wrong! => " + e.message, 400);
      }
    } else {
      res.sendError(error, "Something wen't wrong!", 400);
    }
  },

  update: async (req, res) => {
    try {
      await Account.update(
        {
          name: req.body.name,
          type: req.body.type,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );

      const account = await Account.findOne({
        where: {
          id: req.params.id,
        },
      });

      res.sendResponse({ account }, "Successfully updated!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },

  delete: async (req, res) => {
    try {
      await Account.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.sendResponse({}, "Successfully deleted!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },
};
