const { SalesOrderStatus } = require("shared/enums");
const { sequelize } = require("../models");
const Customer = require("../models/customer");
const Invoice = require("../models/invoice");
const InvoiceProducts = require("../models/junction/invoice-products");
const SalesOrder = require("../models/sales-order");
const User = require("../models/user");
const {
  updateInvoice,
  findInvoiceById,
} = require("../services/InvoiceService");

module.exports = {
  all: async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        order: [["createdAt", "DESC"]],
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
            ],
          },
        ],
      });

      res.sendResponse({ invoices }, "Successfully fetched!");
    } catch (error) {
      res.sendError({ error }, "Something went wrong!");
    }
  },

  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { invoice, products } = req.body.validated;
      let createdInvoice;
      if (invoice) {
        createdInvoice = await Invoice.create(invoice, { transaction });

        if (products) {
          await Promise.all(
            products.map((product) => {
              return InvoiceProducts.create(
                {
                  ...product,
                  invoice_id: createdInvoice.id,
                },
                { transaction }
              );
            })
          );
        }

        if (invoice.sales_order_id) {
          await SalesOrder.update(
            { status: SalesOrderStatus.INVOICED },
            { where: { id: invoice.sales_order_id }, transaction }
          );
        }
      }
      await transaction.commit();

      const newInvoice = await findInvoiceById(createdInvoice.id);

      res.sendResponse({ invoice: newInvoice }, "Successfully registered!");
    } catch (error) {
      await transaction.rollback();
      res.sendError({ error }, "Something went wrong!");
    }
  },

  byId: async (req, res) => {
    try {
      const invoice = await findInvoiceById(req.params.id);

      if (!invoice) {
        return res.sendError({}, "Invoice not found!", 404);
      }

      res.sendResponse({ invoice }, "Successfully fetched!");
    } catch (error) {
      res.sendError({ error }, "Something went wrong!");
    }
  },

  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      await updateInvoice(req.params.id, data, transaction);

      await transaction.commit();
      res.sendResponse({ done: true }, "Successfully updated!");
    } catch (error) {
      await transaction.rollback();
      res.sendError({ error }, "Something went wrong!");
    }
  },
};
