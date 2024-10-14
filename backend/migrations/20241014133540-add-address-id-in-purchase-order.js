"use strict";

const { isColumnExistInTable } = require("../models");
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

    const isExist = await isColumnExistInTable(
      PurchaseOrder.getTableName(),
      "address_id"
    );

    if (!isExist) {
      await queryInterface.addColumn(
        PurchaseOrder.getTableName(),
        "address_id",
        PurchaseOrder.getAttributes()["address_id"]
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
      PurchaseOrder.getTableName(),
      "address_id"
    );

    if (isExist) {
      await queryInterface.removeColumn(
        PurchaseOrder.getTableName(),
        "address_id"
      );
    }
  },
};
