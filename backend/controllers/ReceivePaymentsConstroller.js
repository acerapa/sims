const ReceivePayment = require("../models/received-payment");

module.exports = {
  all: async (req, res) => {
    try {
      const receivePayments = await ReceivePayment.findAll();

      res.sendResponse(
        { receive_payments: receivePayments },
        "Successfully fetched all receive payments"
      );
    } catch (error) {
      res.sendError({ error }, "Failed to fetch receive payments");
    }
  },

  register: async (req, res) => {
    try {
      const data = req.body.validated;
      const newReceivePayment = await ReceivePayment.create(data);

      res.sendResponse(
        { receive_payment: newReceivePayment },
        "Successfully registered receive payment"
      );
    } catch (error) {
      res.sendError({ error }, "Failed to register receive payment");
    }
  },
};
