
const { InvoiceStatus } = require("shared/enums");
const { sequelize } = require("../models");
const Customer = require("../models/customer");
const Invoice = require("../models/invoice");
const ReceivedPayment = require("../models/received-payment");
const SalesOrder = require("../models/sales-order");
const User = require("../models/user");
const {
  findreceivedPaymentDetailed,
  getInvoiceNewInvoiceStatus,
  getInvoiceLatestReceivedpayment,
  setNewProductStockUponFirstPayment,
} = require("../services/ReceivedPaymentService");
const InvoiceProducts = require("../models/junction/invoice-products");

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
      const received_payment = await getInvoiceLatestReceivedpayment(
        req.params.invoice_id
      );

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
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      const invoiceToPay = await Invoice.findByPk(data.invoice_id, {
        include: [
          {
            model: ReceivedPayment,
            as: "received_payments"
          },
          {
            model: InvoiceProducts,
            as: "invoice_products"
          }
        ]
      });
      if (!invoiceToPay) throw new Error("Invoice not found");

      if (
        [
          InvoiceStatus.FAILED,
          InvoiceStatus.REFUNDED,
          InvoiceStatus.PAID,
        ].includes(invoiceToPay.status)
      ) {
        throw new Error("Invoice is already paid, refunded, or failed");
      }

      const invoice_status = await getInvoiceNewInvoiceStatus(
        invoiceToPay,
        data
      );

      const newReceivePayment = await ReceivedPayment.create(
        { invoice_status: invoice_status, ...data },
        { transaction }
      );

      // Check if this is the first payment
      if (invoiceToPay.received_payments.length == 0) {
        await setNewProductStockUponFirstPayment(invoiceToPay.invoice_products)
      }

      if (invoiceToPay.status != invoice_status) {
        await invoiceToPay.update({ status: invoice_status }, { transaction });
      }

      await transaction.commit();
      const received_payment = await findreceivedPaymentDetailed(
        newReceivePayment.id
      );

      res.sendResponse(
        { received_payment: received_payment },
        "Successfully registered receive payment"
      );
    } catch (error) {
      await transaction.rollback();
      res.sendError({ error }, "Failed to register receive payment");
    }
  },
};
