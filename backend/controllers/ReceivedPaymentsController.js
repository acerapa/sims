const Customer = require("../models/customer");
const Invoice = require("../models/invoice");
const ReceivedPayment = require("../models/received-payment");
const SalesOrder = require("../models/sales-order");
const User = require("../models/user");
const {
  findreceivedPaymentDetailed,
} = require("../services/ReceivedPaymentService");

module.exports = {
  all: async (req, res) => {
    try {
      const receivePayments = await ReceivedPayment.findAll({
        order: [["id", "DESC"]],
        include: [
          {
            model: Invoice,
            as: "invoice",
            attributes: ["id", "total", "customer_id"],
            include: [
              {
                model: Customer,
                as: "customer",
                attributes: ["id", "first_name", "last_name"],
              },
              {
                model: SalesOrder,
                as: "sales_order",
                attributes: ["id", "customer_id"],
                include: [
                  {
                    model: Customer,
                    as: "customer",
                    attributes: ["id", "first_name", "last_name"],
                  },
                ],
              },
            ],
          },
          {
            model: User,
            as: "cashier",
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      });

      res.sendResponse(
        { received_payments: receivePayments },
        "Successfully fetched all receive payments"
      );
    } catch (error) {
      res.sendError({ error }, "Failed to fetch receive payments");
    }
  },

  byId: async (req, res) => {
    try {
      const received_payment = await ReceivedPayment.findByPk(req.params.id);

      if (!received_payment) throw new Error("Received payment not found");

      res.sendResponse(
        { received_payment },
        "Successfully fetched receive payment by ID"
      );
    } catch (error) {
      res.sendError({ error }, "Failed to fetch receive payment by ID");
    }
  },

  latestPaymentByInvoiceId: async (req, res) => {
    try {
      const received_payment = await ReceivedPayment.findOne({
        order: [["id", "DESC"]],
        where: { invoice_id: req.params.invoice_id },
      });

      res.sendResponse(
        { received_payment },
        "Successfully fetched latest receive payment by invoice ID"
      );
    } catch (error) {
      res.sendError({ error }, "Failed to retrieved customer payment");
    }
  },

  paymentsByInvoiceId: async (req, res) => {
    try {
      const received_payments = await ReceivedPayment.findAll({
        where: { invoice_id: req.params.invoice_id },
      });

      res.sendResponse(
        { received_payments },
        "Successfully fetched receive payments by invoice ID"
      );
    } catch (error) {
      res.sendError(
        { error },
        "Failed to fetch receive payments by invoice ID"
      );
    }
  },

  register: async (req, res) => {
    try {
      const data = req.body.validated;
      const newReceivePayment = await ReceivedPayment.create(data);

      const received_payment = await findreceivedPaymentDetailed(
        newReceivePayment.id
      );

      res.sendResponse(
        { received_payment: received_payment },
        "Successfully registered receive payment"
      );
    } catch (error) {
      res.sendError({ error }, "Failed to register receive payment");
    }
  },
};
