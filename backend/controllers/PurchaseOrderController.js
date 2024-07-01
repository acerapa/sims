const Address = require("../models/address");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");

module.exports = {
  all: async (req, res) => {
    try {
      const orders = await PurchaseOrder.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Address,
            as: "address",
          },
          {
            model: Supplier,
            as: "supplier",
          },
        ],
      });
      res.sendResponse({ orders }, "Successfully fetched!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.messge);
    }
  },

  register: async (req, res) => {
    try {
      const purchaseOrder = await PurchaseOrder.create(req.body.order, {
        include: [
          {
            model: Address,
            as: "address",
          },
        ],
      });

      req.body.products.forEach(async (product) => {
        await purchaseOrder.addProduct(product.id, {
          through: {
            quantity: product.quantity,
            amount: product.amount,
          },
        });
      });
      res.sendResponse({}, "Successfully created!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.messge);
    }
  },
};
