"use strict";

const { isColumnExistInTable } = require("../models");
const StockTransfer = require("../models/stock-transfer");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const isExist = await isColumnExistInTable(
      StockTransfer.getTableName(),
      "po_no"
    );

    if (!isExist) {
      await queryInterface.addColumn(
        StockTransfer.getTableName(),
        "po_no",
        StockTransfer.getAttributes()["po_no"]
      );
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    const isExist = await isColumnExistInTable(
      StockTransfer.getTableName(),
      "po_no"
    );

    if (isExist) {
      await queryInterface.removeColumn(StockTransfer.getTableName(), "po_no");
    }
  },
};
