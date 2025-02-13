"use strict";
const { areColumnsExistInTable, isColumnExistInTable } = require("../models");
const ProductCategory = require("../models/product-category");
const tableName = ProductCategory.getTableName();
const attributes = ProductCategory.getAttributes();
const column = "general_cat";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const isExist = await isColumnExistInTable(tableName, column);

    if (!isExist) {
      await queryInterface.addColumn(tableName, column, attributes[column]);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    const isExist = await isColumnExistInTable(tableName, column);

    if (isExist) {
      await queryInterface.removeColumn(tableName, column);
    }
  },
};
