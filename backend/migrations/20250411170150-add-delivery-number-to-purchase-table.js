"use strict";

const { isColumnExistInTable } = require("../models");
const PurchaseOrder = require("../models/purchase-order");
const column = "delivery_number";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      PurchaseOrder.getTableName(),
      column
    );

    if (!isExist) {
      await queryInterface.addColumn(PurchaseOrder.getTableName(), column, {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      PurchaseOrder.getTableName(),
      column
    );

    if (isExist) {
      await queryInterface.removeColumn(PurchaseOrder.getTableName(), column);
    }
  },
};
