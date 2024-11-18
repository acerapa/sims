const { sequelize } = require("../models");
const ProductTransfer = require("../models/product-transfer");
const Branch = require("../models/branch");
const User = require("../models/user");
const Product = require("../models/product");
const ProductTransaction = require("../models/product-transaction");
const StockTranfer = require("../models/stock-transfer");
const Supplier = require("../models/supplier");

module.exports = {
  all: async (req, res) => {
    try {
      const transfers = await StockTranfer.findAll({
        order: [["createdAt", "DESC"]],
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
            through: ProductTransfer,
            as: "products",
            attributes: ["id"],
          },
          {
            model: Supplier,
            as: "supplier",
          },
        ],
      });

      res.sendResponse({ transfers }, "Successfully fetched!");
    } catch (e) {
      res.sendError(e);
    }
  },
  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      const transfer = await StockTranfer.create(data.transfer, {
        transaction: transaction,
      });

      await Promise.all(
        data.products.map((product) => {
          product.transfer_id = transfer.id;
          return ProductTransaction.create(product, {
            transaction: transaction,
          });
        })
      );

      await transaction.commit();
      res.sendResponse({}, "Successfully Created!");
    } catch (e) {
      await transaction.rollback();
      res.sendError(e);
    }
  },
  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      if (data.transfer) {
        await StockTranfer.update(data.transfer, {
          where: {
            id: req.params.id,
          },
          transaction: transaction,
        });
      }
      if (data.products) {
        const products = await ProductTransaction.findAll({
          where: {
            transfer_id: req.params.id,
          },
          attributes: ["id", "product_id"],
        });

        const currentProductIds = products.map((p) => p.product_id);

        await Promise.all([
          // determine products needs to be created
          ...data.products
            .filter((p) => !currentProductIds.includes(p.product_id))
            .map((p) =>
              ProductTransaction.create(
                { ...p, transfer_id: req.params.id },
                { transaction: transaction }
              )
            ),
          // determine the products weither they it will be updated or deleted
          ...products.map((product) => {
            const dataProductIds = data.products.map((p) => p.product_id);

            if (dataProductIds.includes(product.product_id)) {
              const toUpdateFields = data.products.find(
                (p) => p.product_id == product.product_id
              );

              return ProductTransaction.update(toUpdateFields, {
                where: {
                  id: product.id,
                },
                transaction: transaction,
              });
            } else {
              return ProductTransaction.destroy({
                where: {
                  id: product.id,
                },

                transaction: transaction,
              });
            }
          }),
        ]);
      }
      await transaction.commit();
      res.sendResponse({}, "Successfully Updated!");
    } catch (e) {
      await transaction.rollback();
      res.sendError(e);
    }
  },
  getById: async (req, res) => {
    try {
      const transfer = await StockTranfer.findOne({
        where: {
          id: req.params.id,
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
            through: ProductTransfer,
            as: "products",
            attributes: ["id"],
          },
          {
            model: Supplier,
            as: "supplier",
          }
        ],
      });

      res.sendResponse({ transfer }, "Successfully fetched!");
    } catch (e) {
      res.sendError(e);
    }
  },
  destroy: async (req, res) => {
    try {
      await StockTranfer.destroy({
        where: {
          id: req.params.id,
        },
      });

      return res.sendResponse({}, "Successfully deleted!");
    } catch (error) {
      res.sendError(error);
    }
  },
};
