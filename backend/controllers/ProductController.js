const crypto = require("crypto");
const Product = require("../models/product");
const Supplier = require("../models/supplier");
const Account = require("../models/account");
const { Op } = require("sequelize");
const ProductSettings = require("../models/product-setting");

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
          {
            model: ProductSettings,
            as: "product_setting",
            attributes: ["id", "point"],
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
      for (let ndx = 0; ndx < req.body.suppliers.length; ndx++) {
        await product.addSupplier(req.body.suppliers[ndx], {
          through: {
            cost: req.body.cost,
          },
        });
      }

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

      const product = await Product.findByPk(req.body.id);
      const suppliers = await Supplier.findAll({
        where: {
          id: {
            [Op.in]: req.body.suppliers,
          },
        },
      });

      // remove all the suppliers
      await product.removeSuppliers(await product.getSuppliers());

      // add the associations again
      for (let ndx = 0; ndx < suppliers.length; ndx++) {
        await product.addSupplier(suppliers[ndx], {
          through: {
            cost: req.body.cost,
          },
        });
      }

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
