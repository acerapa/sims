"use strict";

const { isColumnExistInTable } = require("../models");
const ProductOrder = require("../models/product-order");

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
      ProductOrder.getTableName(),
      "description"
    );
    if (!isExist) {
      await queryInterface.addColumn(
        ProductOrder.getTableName(),
        "description",
        ProductOrder.getAttributes()["description"]
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
      ProductOrder.getTableName(),
      "description"
    );

    if (isExist) {
      await queryInterface.removeColumn(
        ProductOrder.getTableName(),
        "description"
      );
    }
  },
};
