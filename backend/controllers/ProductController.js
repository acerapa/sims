const crypto = require("crypto");
const Product = require("../models/product");
const Supplier = require("../models/supplier");
const Account = require("../models/account");
const { Op } = require("sequelize");
const ProductSettings = require("../models/product-setting");
const ProductCategory = require("../models/product-category");

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
            model: ProductCategory,
            as: "product_categories",
            attributes: ["id", "name"],
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

      for (let category of req.body.categories) {
        await product.addProductCategory(category);
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
      await Product.destroy({ where: { id: req.params.id } });
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

  inventoryStockStatus: async (req, res) => {
    try {
      const products = await Product.findAll({
        where: {
          status: "active",
          type: "inventory",
        },
        attributes: ["id", "name", "quantity_in_stock"],
        include: [
          {
            model: ProductCategory,
            as: "category",
          },
        ],
      });

      const groupedByCat = Object.entries(
        Object.groupBy(products, ({ category }) => category.id)
      ).map((item) => {
        return {
          category: item[1][0].category,
          products: item[1],
        };
      });

      // TODO: Need to query from PO and Sales

      res.sendResponse(
        { grouped_by_gategory: groupedByCat },
        "Successfully fetched",
        200
      );
    } catch (e) {
      res.sendError(e, "Something wen't wrong!");
    }
  },
};
