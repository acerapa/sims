const ReceivePayment = require("../models/receive-payment");

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
};
