const Address = require("../models/address");
const Product = require("../models/product");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");

const findOrder = async (id) => {
  return await PurchaseOrder.findByPk(id, {
    include: [
      {
        model: Address,
        as: "address",
      },
      {
        model: Supplier,
        as: "supplier",
      },
      {
        model: Product,
        as: "products",
        include: [
          {
            model: Supplier,
            as: "suppliers",
            attributes: ["id"],
          },
        ],
      },
    ],
  });
};

module.exports = {
  findOrder,
};
