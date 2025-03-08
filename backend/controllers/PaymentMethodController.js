const PaymentMethod = require("../models/payment-method");

module.exports = {
  all: async (req, res) => {
    try {
      const paymentMethods = await PaymentMethod.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.sendResponse({ paymentMethods }, "Payment methods");
    } catch (error) {
      res.sendError(error, "Something went wrong");
    }
  },

  register: async (req, res) => {
    try {
      const paymentMethod = await PaymentMethod.create(req.body.validated);
      res.sendResponse({ paymentMethod }, "Payment method created");
    } catch (error) {
      res.sendError(error, "Something went wrong");
    }
  },

  getById: async (req, res) => {
    try {
      const paymentMethod = await PaymentMethod.findByPk(req.params.id);
      res.sendResponse(
        { paymentMethod },
        "Successfully fetched payment method"
      );
    } catch (error) {
      res.sendError(error, "Something went wrong");
    }
  },

  update: async (req, res) => {
    try {
      await PaymentMethod.update(req.body.validated, {
        where: { id: req.params.id },
      });

      const paymentMethod = await PaymentMethod.findByPk(req.params.id);

      res.sendResponse(
        { paymentMethod },
        "Successfully updated payment method"
      );
    } catch (error) {
      res.sendError(error, "Something went wrong");
    }
  },

  destroy: async (req, res) => {
    try {
      await PaymentMethod.destroy({ where: { id: req.params.id } });
      res.sendResponse({}, "Successfully deleted payment method");
    } catch (error) {
      res.sendError(error, "Something went wrong");
    }
  },
};
