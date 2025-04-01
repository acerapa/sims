const Invoice = require("../models/invoice");

module.exports = {
  all: async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.sendResponse({ invoices }, "Successfully fetched!");
    } catch (error) {
      res.sendError({ error }, "Something went wrong!");
    }
  },

  register: async (req, res) => {
    try {
      res.sendResponse({ done: true }, "Successfully registered!");
    } catch (error) {
      res.sendError({ error }, "Something went wrong!");
    }
  },
};
