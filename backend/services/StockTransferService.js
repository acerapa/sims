const Branch = require("../models/branch");
const StockTransferProducts = require("../models/junction/stock-transfer-products");
const Product = require("../models/product");
const StockTransfer = require("../models/stock-transfer");
const Supplier = require("../models/supplier");
const User = require("../models/user");

const findTransfer = async (id) => {
  return await StockTransfer.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Branch,
        as: "receiver",
      },
      {
        model: Branch,
        as: "receiver",
        include: [
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "position"],
          },
        ],
      },
      {
        model: Branch,
        as: "sender",
        include: [
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "position"],
          },
        ],
      },
      {
        model: User,
        as: "process_by",
        attributes: ["id", "first_name", "last_name", "position"],
      },
      {
        model: Product,
        through: StockTransferProducts,
        as: "products",
        attributes: ["id"],
      },
      {
        model: Supplier,
        as: "supplier",
      },
    ],
  });
};

module.exports = {
  findTransfer,
};
