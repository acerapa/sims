"use strict";

const { isColumnExistInTable } = require("../models");
const StockTransferProducts = require("../models/junction/stock-transfer-products");
const column = "description";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      StockTransferProducts.getTableName(),
      column
    );

    if (isExist) {
      await queryInterface.removeColumn(
        StockTransferProducts.getTableName(),
        column
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      StockTransferProducts.getTableName(),
      column
    );

    if (!isExist) {
      await queryInterface.addColumn(
        StockTransferProducts.getTableName(),
        column,
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );
    }
  },
};
