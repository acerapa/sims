const PaymentMenthod = require("../models/payment-method");

module.exports = {
  all: async (req, res) => {
    try {
      const paymentMethods = await PaymentMenthod.findAll();
      res.sendResponse({ paymentMethods }, "Payment methods");
    } catch (error) {
      res.sendError(error, "Something went wrong");
    }
  },

  register: async (req, res) => {
    try {
      const paymentMethod = await PaymentMenthod.create(req.body.validated);
      res.sendResponse({ paymentMethod }, "Payment method created");
    } catch (error) {
      res.sendError(error, "Something went wrong");
    }
  },
};
