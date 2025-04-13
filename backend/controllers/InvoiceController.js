const { sequelize } = require("../models");
const Invoice = require("../models/invoice");
const InvoiceProducts = require("../models/junction/invoice-products");

module.exports = {
  all: async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        order: [["createdAt", "DESC"]],
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
      if (invoice) {
        const createdInvoice = await Invoice.create(invoice, { transaction });

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
      }

      res.sendResponse({ done: true }, "Successfully registered!");
    } catch (error) {
      res.sendError({ error }, "Something went wrong!");
    }
  },
};
