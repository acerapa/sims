"use strict";

const { isColumnExistInTable } = require("../models");
const Product = require("../models/product");
const tableName = Product.getTableName();
const attributes = Product.getAttributes();
const column = "model";

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
