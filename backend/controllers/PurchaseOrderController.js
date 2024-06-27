const Address = require("../models/address");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");

module.exports = {
  all: async (req, res) => {
    try {
      const orders = await PurchaseOrder.findAll({
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
        include: {
          model: Address,
          as: "address",
        },
      });
      purchaseOrder.addProducts(req.body.products);
      res.sendResponse({}, "Successfully created!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.messge);
    }
  },
};
