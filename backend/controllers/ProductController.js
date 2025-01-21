const crypto = require("crypto");
const Product = require("../models/product");
const Supplier = require("../models/supplier");
const Account = require("../models/account");
const { Op } = require("sequelize");
const ProductSettings = require("../models/product-setting");
const ProductCategory = require("../models/product-category");
const ProductToCategories = require("../models/junction/product-to-categories");
const { ProductType } = require("shared");
const ProductDetails = require("../models/product-details");
const { sequelize } = require("../models/index");

module.exports = {
  all: async (req, res) => {
    try {
      const items = await Product.findAll({
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
            as: "categories",
            attributes: ["id", "name"],
          },
          {
            model: ProductSettings,
            as: "product_setting",
            attributes: ["id", "point"],
          },
        ],
      });
      res.sendResponse({ items }, "Successfully fetched!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
    }
  },
  getProducts: async (req, res) => {
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
            as: "categories",
            attributes: ["id", "name"],
          },
          {
            model: ProductDetails,
            as: "product_details",
            include: {
              model: ProductSettings,
              as: "product_setting",
            },
          },
        ],
        where: {
          type: ProductType.INVENTORY,
        },
      });
      res.sendResponse({ products }, "Successfully fetched!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, {
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
            as: "categories",
            attributes: ["id", "name"],
          },
          {
            model: ProductDetails,
            as: "product_details",
            include: {
              model: ProductSettings,
              as: "product_setting",
            },
          },
        ],
        where: {
          type: ProductType.INVENTORY,
        },
      });

      res.sendResponse({ product }, "Successfully fetched!");
    } catch (error) {
      res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
    }
  },
  getServices: async (req, res) => {
    try {
      const services = await Product.findAll({
        where: {
          type: ProductType.NON_INVENTORY,
        },
      });

      res.sendResponse({ services }, "Successfully fetched!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
    }
  },
  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      // format data
      const data = {
        ...req.body.validated.product,
        product_details: req.body.validated.details,
      };
      const product = await Product.create(data, {
        include: {
          model: ProductDetails,
          as: "product_details",
        },
        transaction,
      });

      if (req.body.validated.categories) {
        const categories = req.body.validated.categories;
        await Promise.all(
          categories.map((category) => {
            return product.addCategory(category, { transaction });
          })
        );
      }

      if (req.body.validated.suppliers) {
        const suppliers = req.body.validated.suppliers;
        await Promise.all(
          suppliers.map((supplier) => {
            return product.addSupplier(supplier.supplier_id, {
              transaction,
              through: {
                cost: supplier.cost,
              },
            });
          })
        );
      }

      await transaction.commit();
      res.sendResponse({}, "Successfully Registered!");
    } catch (e) {
      await transaction.rollback();
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const data = req.body.validated;
      await Product.update(data.product, {
        where: {
          id: req.params.id,
        },
      });

      res.sendResponse({}, "Successfully updated!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
    }
  },

  update: async (req, res) => {
    try {
      await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      const product = await Product.findByPk(req.params.id);
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

      if (req.body.categories) {
        const currentCategorys = await ProductToCategories.findAll({
          where: { product_id: req.params.id },
          attributes: ["id", "category_id"],
        });

        const toRemove = currentCategorys.filter(
          (c) => !req.body.categories.includes(c.category_id)
        );

        const toAdd = req.body.categories.filter(
          (c) => !currentCategorys.map((pc) => pc.category_id).includes(c)
        );

        await Promise.all([
          ...toRemove.map((c) =>
            ProductToCategories.destroy({ where: { id: c.id } })
          ),
          ...toAdd.map((c) =>
            ProductToCategories.create({
              product_id: req.params.id,
              category_id: c,
            })
          ),
        ]);
      }

      res.sendResponse({}, "Successfully updated!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },

  destroy: async (req, res) => {
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
        attributes: ["id"],
        include: {
          model: ProductDetails,
          as: "product_details",
          attributes: ["item_code"],
        },
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
