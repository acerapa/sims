const { sequelize } = require("../models");
const Branch = require("../models/branch");
const User = require("../models/user");
const Product = require("../models/product");
const StockTranfer = require("../models/stock-transfer");
const Supplier = require("../models/supplier");
const StockTransferProducts = require("../models/junction/stock-transfer-products");
const {
  findTransfer,
  updateTransfer,
} = require("../services/StockTransferService");

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
            through: StockTransferProducts,
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
      const newTransfer = await StockTranfer.create(data.transfer, {
        transaction: transaction,
      });

      await Promise.all(
        data.products.map((product) => {
          product.stock_transfer_id = newTransfer.id;
          return StockTransferProducts.create(product, {
            transaction: transaction,
          });
        })
      );

      await transaction.commit();

      const transfer = await findTransfer(newTransfer.id);
      res.sendResponse({ transfer }, "Successfully Created!");
    } catch (e) {
      await transaction.rollback();
      res.sendError(e);
    }
  },
  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;

      await updateTransfer(req.params.id, data, transaction);

      await transaction.commit();

      const transfer = await findTransfer(req.params.id);

      res.sendResponse({ transfer }, "Successfully Updated!");
    } catch (e) {
      await transaction.rollback();
      res.sendError(e);
    }
  },
  getById: async (req, res) => {
    try {
      const transfer = await findTransfer(req.params.id);

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
