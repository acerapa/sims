const { SalesOrderStatus } = require("shared/enums");
const { sequelize } = require("../models");

const Customer = require("../models/customer");
const Invoice = require("../models/invoice");
const InvoiceProducts = require("../models/junction/invoice-products");
const SalesOrder = require("../models/sales-order");
const User = require("../models/user");
const ReceivedPayment = require("../models/received-payment");
const Product = require("../models/product");
const ProductDetails = require("../models/product-details");

const { findInvoiceById } = require("../services/InvoiceService");
const { Op } = require("sequelize");
const ALIASES = require("../const/alias");

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
      const { invoice, products } = req.body;
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

        // Update sales order status to invoiced
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

  invoiceByCustomer: async (req, res) => {
    try {
      const { from, to } = req.query;
      let customers = await Customer.findAll({
        include: [
          {
            model: Invoice,
            as: "invoices",
            required: false,
            where: {
              issue_date: {
                [Op.gte]: new Date(from),
                [Op.lte]: new Date(to),
              },
            },
            include: [
              {
                model: ReceivedPayment,
                as: "received_payments",
                required: true,
                attributes: ["id", "amount", "remaining_balance"],
              },
              {
                model: Product,
                as: "products",
                attributes: ["id"],
                include: [
                  {
                    model: ProductDetails,
                    as: "product_details",
                    attributes: ["sales_description"],
                  },
                ],
              },
            ],
          },
          {
            model: SalesOrder,
            as: "sales_orders",
            attributes: ["id"],
            include: [
              {
                model: Invoice,
                as: "invoice",
                required: true,
                where: {
                  issue_date: {
                    [Op.gte]: new Date(from),
                    [Op.lte]: new Date(to),
                  },
                },
                include: [
                  {
                    model: ReceivedPayment,
                    as: "received_payments",
                    required: true,
                  },
                  {
                    model: Product,
                    as: "products",
                    attributes: ["id"],
                    include: [
                      {
                        model: ProductDetails,
                        as: "product_details",
                        attributes: ["sales_description"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      // Extract data and combine information from sales order and invoice
      if (customers.length) {
        customers.map((customer) => {
          const invoices = customer.invoices;
          const salesOrders = customer.sales_orders;

          salesOrders.forEach((salesOrder) => {
            if (salesOrder.invoice) {
              invoices.push(salesOrder.invoice);
            }
          });

          customer.invoices = invoices;
        });
      }

      // Remove customer that do not have invoice
      customers = customers.filter((customer) => customer.invoices.length);

      res.sendResponse({ customers }, "Successfully fetched!");
    } catch (error) {
      res.sendError({ error }, "Something went wrong!");
    }
  },

  salesByRep: async (req, res) => {
    try {
      const invoices = await User.findAll({
        include: [
          {
            model: Invoice,
            as: ALIASES.INVOICES,
            required: true,
            include: [
              {
                model: Customer,
                as: ALIASES.CUSTOMER,
                attributes: ["id", "first_name", "last_name"],
              },
              {
                model: Product,
                as: ALIASES.PRODUCTS,
                attributes: ["id"],
                include: [
                  {
                    model: ProductDetails,
                    as: ALIASES.PRODUCT_DETAILS,
                    attributes: ["sales_description"],
                  },
                ],
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
};
