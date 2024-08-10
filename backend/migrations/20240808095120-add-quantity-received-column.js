"use strict";

const { areColumnsExistInTable } = require("../models");
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

    const areColumnsExist = await areColumnsExistInTable(
      ProductOrder.getTableName(),
      ["status", "quantity_received"]
    );

    if (!areColumnsExist["status"]) {
      await queryInterface.addColumn(
        ProductOrder.getTableName(),
        "status",
        ProductOrder.getAttributes()["status"]
      );
    }

    if (!areColumnsExist["quantity_received"]) {
      await queryInterface.addColumn(
        ProductOrder.getTableName(),
        "quantity_received",
        ProductOrder.getAttributes()["quantity_received"]
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

    const areColumnsExist = await areColumnsExistInTable(
      ProductOrder.getTableName(),
      ["status", "quantity_received"]
    );

    if (areColumnsExist["status"]) {
      await queryInterface.removeColumn(ProductOrder.getTableName(), "status");
    }

    if (areColumnsExist["quantity_received"]) {
      await queryInterface.removeColumn(
        ProductOrder.getTableName(),
        "quantity_received"
      );
    }
  },
};
