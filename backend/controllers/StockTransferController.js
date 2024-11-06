const { sequelize } = require("../models");
const ProductTransfer = require("../models/product-transfer");
const Branch = require("../models/branch");
const User = require("../models/user");
const Product = require("../models/product");

// test
const ProductTransaction = require("../models/product-transaction");
const StockTranfer = require("../models/stock-transfer");

module.exports = {
  getAllByType: async (req, res) => {
    try {
      const transfer = await StockTranfer.findAll({
        where: {
          type: req.params.type,
        },
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
        ],
      });

      res.sendResponse({ transfer }, "Successfully fetched!");
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
