const crypto = require("crypto");
const Product = require("../models/product");
const Supplier = require("../models/supplier");
const Account = require("../models/account");

module.exports = {
  all: async (req, res) => {
    try {
      const products = await Product.findAll({
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: Supplier,
            as: "suppliers",
            attributes: ["id"],
            through: { attributes: ["cost"] },
          },
          {
            model: Account,
            as: "income",
            attributes: ["id"],
          },
          {
            model: Account,
            as: "expense",
            attributes: ["id"],
          },
        ],
      });
      res.sendResponse({ products }, "Successfully fetched!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
    }
  },

  register: async (req, res) => {
    try {
      const product = await Product.create(req.body);
      req.body.suppliers.forEach(async (supplier) => {
        await product.addSupplier(supplier.id, {
          through: {
            cost: supplier.cost,
          },
        });
      });
      res.sendResponse({}, "Successfully Registered!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },

  update: async (req, res) => {
    try {
      await Product.update(req.body, {
        where: {
          id: req.body.id,
        },
      });
      res.sendResponse({}, "Successfully updated!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },

  delete: async (req, res) => {
    try {
      await Product.destroy({ where: { id: req.body.id } });
      res.sendResponse({}, "Successfully deleted!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },

  productItemCode: async (req, res) => {
    let itemCode = crypto.randomBytes(4).toString("hex");
    try {
      let itemCodes = await Product.findAll({
        attributes: ["item_code"],
      });

      while (itemCodes.map((p) => p.item_code).includes(itemCode)) {
        itemCode = crypto.randomBytes(4).toString("hex");
      }

      res.sendResponse({ item_code: itemCode }, "Item code generated!");
    } catch (e) {
      res.sendError(e, "Something went wrong! => " + e.message);
    }
  },
};
