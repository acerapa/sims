const Customer = require("../models/customer");
const Invoice = require("../models/invoice");
const ReceivePayment = require("../models/received-payment");
const SalesOrder = require("../models/sales-order");
const User = require("../models/user");

module.exports = {
  all: async (req, res) => {
    try {
      const receivePayments = await ReceivePayment.findAll({
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
