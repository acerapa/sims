const SalesOrder = require("../models/sales-order");

module.exports = {
  register: async (req, res) => {
    try {
      await SalesOrder.create(req.body.validated);
      res.sendResponse({}, "Sales order created successfully", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong", 400);
    }
  },

  all: async (req, res) => {
    try {
      const salesOrders = await SalesOrder.findAll();
      res.sendResponse(salesOrders, "Sales orders fetched successfully", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong", 400);
    }
  },
};
