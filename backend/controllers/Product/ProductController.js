const crypto = require("crypto");
const Product = require("../../models/product");
const Supplier = require("../../models/supplier");
const Account = require("../../models/account");
const ProductSettings = require("../../models/product-setting");
const ProductCategory = require("../../models/product-category");
const ProductToCategories = require("../../models/junction/product-to-categories");
const ProductDetails = require("../../models/product-details");
const ProductSupplier = require("../../models/product-supplier");

const { Op } = require("sequelize");
const { ProductType } = require("shared");
const { sequelize } = require("../../models/index");
const {
  findProduct,
  groupCategories,
} = require("../../services/ProductService");
const InvoiceProducts = require("../../models/junction/invoice-products");
const SalesOrderProduct = require("../../models/junction/sales-order-product");
const PurchaseOrderProducts = require("../../models/junction/purchase-order-products");

module.exports = {
  all: async (req, res) => {
    try {
      const items = await Product.findAll({
        order: [["createdAt", "DESC"]],
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
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Supplier,
            as: "suppliers",
            attributes: ["id", "company_name"],
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
      const product = await findProduct(req.params.id);
      res.sendResponse({ product }, "Successfully fetched!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
    }
  },

  getProductByIds: async (req, res) => {
    try {
      const products = await Product.findAll({
        where: {
          id: {
            [Op.in]: req.query.ids,
          },
        },
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
      });

      res.sendResponse({ products }, "Successfully fetched!");
    } catch (error) {
      res.sendError({ error }, "Something wen't wrong!", 400);
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

      if (req.body.validated.category) {
        product.addCategory(req.body.validated.category, { transaction });
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
          }),
        );
      }

      await transaction.commit();

      const p = await findProduct(product.dataValues.id);

      res.sendResponse({ product: p }, "Successfully Registered!");
    } catch (e) {
      await transaction.rollback();
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },

  updateProduct: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      await Product.update(data.product, {
        where: {
          id: req.params.id,
        },
        transaction,
      });

      await ProductDetails.update(data.details, {
        where: {
          product_id: req.params.id,
        },
        transaction,
      });

      if (data.categories) {
        const productToCategories = await ProductToCategories.findAll({
          where: {
            product_id: req.params.id,
          },
        });

        // get categories to remove and to add
        const categoriesToRemove = productToCategories.filter(
          (ptc) => !data.categories.includes(ptc.category_id),
        );
        const categoriesToAdd = data.categories.filter(
          (category) =>
            !productToCategories
              .map((ptc) => ptc.category_id)
              .includes(category),
        );

        await Promise.all([
          ...categoriesToRemove.map((cat) => {
            return ProductToCategories.destroy({
              where: {
                id: cat.id,
              },
              transaction,
            });
          }),
          ...categoriesToAdd.map((category_id) => {
            return ProductToCategories.create(
              {
                product_id: req.params.id,
                category_id,
              },
              {
                transaction,
              },
            );
          }),
        ]);
      }

      if (data.suppliers) {
        const productToSuppliers = await ProductSupplier.findAll({
          where: {
            product_id: req.params.id,
          },
        });

        // get suppliers to remove, add  and update
        const suppliersToRemove = productToSuppliers.filter(
          (ptc) =>
            !data.suppliers
              .map((sup) => sup.supplier_id)
              .includes(ptc.supplier_id),
        );

        const suppliersToAdd = data.suppliers.filter(
          (sup) =>
            !productToSuppliers
              .map((ptc) => ptc.supplier_id)
              .includes(sup.supplier_id),
        );

        const suppliersToUpdate = data.suppliers.filter((sup) => {
          const isExist = productToSuppliers
            .map((ptc) => ptc.supplier_id)
            .includes(sup.supplier_id);

          const ptc = productToSuppliers.find(
            (ptc) => ptc.supplier_id === sup.supplier_id,
          );

          return isExist && ptc.cost !== sup.cost;
        });

        await Promise.all([
          ...suppliersToRemove.map((sup) => {
            return ProductSupplier.destroy({
              where: {
                id: sup.id,
              },
              transaction,
            });
          }),
          ...suppliersToAdd.map((sup) => {
            return ProductSupplier.create(
              {
                product_id: req.params.id,
                supplier_id: sup.supplier_id,
                cost: sup.cost,
              },
              { transaction },
            );
          }),
          ...suppliersToUpdate.map((sup) => {
            return ProductSupplier.update(
              {
                cost: sup.cost,
              },
              {
                where: {
                  product_id: req.params.id,
                  supplier_id: sup.supplier_id,
                },
                transaction,
              },
            );
          }),
        ]);
      }

      await transaction.commit();
      res.sendResponse({}, "Successfully updated!");
    } catch (e) {
      await transaction.rollback();
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
          (c) => !req.body.categories.includes(c.category_id),
        );

        const toAdd = req.body.categories.filter(
          (c) => !currentCategorys.map((pc) => pc.category_id).includes(c),
        );

        await Promise.all([
          ...toRemove.map((c) =>
            ProductToCategories.destroy({ where: { id: c.id } }),
          ),
          ...toAdd.map((c) =>
            ProductToCategories.create({
              product_id: req.params.id,
              category_id: c,
            }),
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

      while (
        itemCodes.map((p) => p.product_details.item_code).includes(itemCode)
      ) {
        itemCode = crypto.randomBytes(4).toString("hex");
      }

      res.sendResponse({ item_code: itemCode }, "Item code generated!");
    } catch (e) {
      res.sendError(e, "Something went wrong! => " + e.message);
    }
  },

  checkItemCodeExist: async (req, res) => {
    const itemCode = req.params.item_code;
    let itemCodes = await Product.findAll({
      attributes: ["id"],
      include: {
        model: ProductDetails,
        as: "product_details",
        attributes: ["item_code"],
      },
    });

    let isExist = itemCodes
      .map((p) => p.product_details.item_code)
      .includes(itemCode);
    res.sendResponse({ is_exist: isExist }, "Item code checked!");
  },

  inventoryStockStatus: async (req, res) => {
    try {
      const products = await ProductCategory.findAll({
        include: [
          {
            model: Product,
            as: "products",
            include: [
              {
                model: ProductDetails,
                as: "product_details",
                attributes: ["id", "purchase_description", "stock"],
              },
              {
                model: Supplier,
                as: "suppliers",
                attributes: ["id", "company_name"],
              },
              {
                model: InvoiceProducts,
                as: "invoice_products",
                attributes: ["id", "invoice_id", "quantity"],
              },
              {
                model: SalesOrderProduct,
                as: "so_products",
              },
              {
                model: PurchaseOrderProducts,
                as: "po_products"
              }
            ],
          },
        ],
      });

      res.sendResponse(
        { grouped: groupCategories(products) },
        "Successfully fetched!",
      );
    } catch (e) {
      res.sendError(e, "Something wen't wrong!");
    }
  },
};
