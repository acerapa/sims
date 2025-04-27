const Invoice = require("../models/invoice");

const updateInvoice = async (id, data, transaction) => {
  if (data.invoice) {
    await Invoice.update(data.invoice, { where: { id }, transaction });
  }
};

module.exports = {
  updateInvoice,
};
