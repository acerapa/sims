const Address = require("../models/address");
const Product = require("../models/product");
const SalesOrder = require("../models/sales-order");

const findSalesOrder = async (id) => {
  return await SalesOrder.findByPk(id, {
    include: [
      {
        model: Address,
        as: "shipment_address",
      },
      {
        model: Product,
        as: "products",
      },
    ],
  });
};

module.exports = {
  findSalesOrder,
};
