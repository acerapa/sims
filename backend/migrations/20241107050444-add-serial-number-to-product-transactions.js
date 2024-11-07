"use strict";

const { isColumnExistInTable } = require("../models");
const ProductTransaction = require("../models/product-transaction");
const tableName = ProductTransaction.getTableName();
const attributes = ProductTransaction.getAttributes();
const columnName = "serial_number";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const isExist = await isColumnExistInTable(tableName, columnName);
    if (!isExist) {
      await queryInterface.addColumn(
        tableName,
        columnName,
        attributes[columnName]
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
    const isExist = await isColumnExistInTable(tableName, columnName);
    if (isExist) {
      await queryInterface.removeColumn(tableName, columnName);
    }
  },
};
