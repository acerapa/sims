const { TransferType } = require("shared/enums");
const { sequelize } = require("../models");
const B2BTransfer = require("../models/b2b-transfer");
const ProductTransfer = require("../models/product-transfer");

module.exports = {
  getAllByType: async (req, res) => {
    try {
      const transfer = await B2BTransfer.findAll({
        where: {
          type: req.params.type,
        },
        order: [["createdAt", "DESC"]],
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
      const transfer = await B2BTransfer.create(data.transfer, {
        transaction: transaction,
      });

      await Promise.all(
        data.products.map((product) => {
          product.transfer_id = transfer.id;
          return ProductTransfer.create(product, { transaction: transaction });
        })
      );

      await transaction.commit();
      res.sendResponse({}, "Successfully Created!");
    } catch (e) {
      await transaction.rollback();
      res.sendError(e);
    }
  },
};
