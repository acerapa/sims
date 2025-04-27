const Customer = require("../models/customer");
const Invoice = require("../models/invoice");
const Product = require("../models/product");
const SalesOrder = require("../models/sales-order");
const User = require("../models/user");

const updateInvoice = async (id, data, transaction) => {
  if (data.invoice) {
    await Invoice.update(data.invoice, { where: { id }, transaction });
  }
};

const findInvoiceById = async (id) => {
  return await Invoice.findByPk(id, {
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "first_name", "last_name"],
      },
      {
        model: User,
        as: "sales_person",
        attributes: ["id", "first_name", "last_name"],
      },
      {
        model: Product,
        as: "products",
        attributes: ["id"],
      },
      {
        model: SalesOrder,
        as: "sales_order",
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "first_name", "last_name"],
          },
          {
            model: User,
            as: "sales_person",
            attributes: ["id", "first_name", "last_name"],
          },
          {
            model: Product,
            as: "products",
            attributes: ["id"],
          },
        ],
      },
    ],
  });
};

module.exports = {
  findInvoiceById,
  updateInvoice,
};
