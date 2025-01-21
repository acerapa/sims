"use strict";

const { isColumnExistInTable } = require("../models");
const ProductDetails = require("../models/product-details");

const column = "is_manually_set_cost";
const table = ProductDetails.getTableName();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const isExist = await isColumnExistInTable(table, column);
    if (!isExist) {
      await queryInterface.addColumn(
        table,
        column,
        ProductDetails.getAttributes()[column]
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

    const isExist = await isColumnExistInTable(table, column);
    if (isExist) {
      await queryInterface.removeColumn(table, column);
    }
  },
};
