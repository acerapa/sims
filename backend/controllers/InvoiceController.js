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
};
