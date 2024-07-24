"use strict";

const { areColumnsExistInTable } = require("../models/index");
const PurchaseOrder = require("../models/purchase-order");

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
      PurchaseOrder.getTableName(),
      ["type", "term_start"]
    );
    if (!areColumnsExist["type"]) {
      await queryInterface.addColumn(
        PurchaseOrder.getTableName(),
        "type",
        PurchaseOrder.getAttributes()["type"]
      );
    }

    if (!areColumnsExist["term_start"]) {
      await queryInterface.addColumn(
        PurchaseOrder.getTableName(),
        "term_start",
        PurchaseOrder.getAttributes()["term_start"]
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

    await queryInterface.removeColumn(PurchaseOrder.getTableName(), "type");
    await queryInterface.removeColumn(PurchaseOrder.getTableName(), "term_start");
  },
};
