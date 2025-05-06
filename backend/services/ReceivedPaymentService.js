const Customer = require("../models/customer");
const Invoice = require("../models/invoice");
const ReceivedPayment = require("../models/received-payment");
const SalesOrder = require("../models/sales-order");
const User = require("../models/user");

const findreceivedPaymentDetailed = async (id) => {
  const receivedPayment = await ReceivedPayment.findByPk(id, {
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

  if (!receivedPayment) {
    throw new Error("Received payment not found");
  }

  return receivedPayment;
};

module.exports = {
  findreceivedPaymentDetailed,
};
