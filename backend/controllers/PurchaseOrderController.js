const Address = require("../models/address");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");
const Product = require("../models/product");

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

  byId: async (req, res) => {
    try {
      const order = await PurchaseOrder.findByPk(req.params.id, {
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
          },
        ],
      });

      res.sendResponse({ order }, "Successfully fetched!");
    } catch (e) {
      res.sendError({ e }, "Something wen't wrong!", 400);
    }
  },

  delete: async (req, res) => {
    try {
      await PurchaseOrder.destroy({
        where: {
          id: req.body.order_id,
        },
      });

      res.sendResponse({}, "Successfully deleted!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong!", 400);
    }
  },
};
