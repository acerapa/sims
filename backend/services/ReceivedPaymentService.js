const { InvoiceStatus } = require("shared/enums");
const Customer = require("../models/customer");
const Invoice = require("../models/invoice");
const ReceivedPayment = require("../models/received-payment");
const SalesOrder = require("../models/sales-order");
const User = require("../models/user");

/**
 * Retrieves a detailed received payment record by its ID with associated invoice, customer, sales order, and cashier information.
 *
 * @param {number} id - The unique identifier of the received payment
 * @returns {Promise<ReceivedPayment>} A detailed received payment record with nested related entities
 * @throws {Error} If the received payment is not found
 */
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

/**
 * Retrieves the most recently created received payment for a specific invoice.
 *
 * @param {number} invoice_id - The unique identifier of the invoice
 * @returns {Promise<ReceivedPayment|null>} The latest received payment for the invoice, or null if no payment exists
 */
const getInvoiceLatestReceivedpayment = async (invoice_id) => {
  return await ReceivedPayment.findOne({
    where: { invoice_id },
    order: [["id", "DESC"]],
  });
};

/**
 * Determines the new invoice status based on the current invoice status and received payment.
 *
 * @param {Object} invoice - The invoice being processed
 * @param {Object} receivedPayment - The received payment details
 * @returns {string} The updated invoice status (UNPAID, PARTIALLY_PAID, or PAID)
 * @throws {Error} If received payment exceeds invoice total or remaining balance
 */
const getInvoiceNewInvoiceStatus = async (invoice, receivedPayment) => {
  let invoice_status = InvoiceStatus.UNPAID;
  if (invoice.status === InvoiceStatus.UNPAID) {
    if (receivedPayment.amount == invoice.total) {
      invoice_status = InvoiceStatus.PAID;
    } else if (receivedPayment.amount < invoice.total) {
      invoice_status = InvoiceStatus.PARTIALLY_PAID;
    } else if (receivedPayment.amount > invoice.total) {
      throw new Error("Received payment is greater than invoice total!");
    }
  } else if (invoice.status === InvoiceStatus.PARTIALLY_PAID) {
    const latestReceivedpayment = await getInvoiceLatestReceivedpayment(
      invoice.id
    );

    if (!latestReceivedpayment) {
      throw new Error("Latest received payment not found");
    } else if (
      receivedPayment.amount == latestReceivedpayment.remaining_balance
    ) {
      invoice_status = InvoiceStatus.PAID;
    } else if (
      receivedPayment.amount < latestReceivedpayment.remaining_balance
    ) {
      invoice_status = InvoiceStatus.PARTIALLY_PAID;
    } else if (
      receivedPayment.amount > latestReceivedpayment.remaining_balance
    ) {
      throw new Error(
        "Received payment is greater than the remaining balance!"
      );
    }
  }
  return invoice_status;
};

module.exports = {
  getInvoiceNewInvoiceStatus,
  findreceivedPaymentDetailed,
  getInvoiceLatestReceivedpayment,
};
