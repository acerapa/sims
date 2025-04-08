"use strict";

const { isColumnExistInTable } = require("../models");
const PurchaseOrderProduct = require("../models/junction/purchase-order-products");
const column = "description";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      PurchaseOrderProduct.getTableName(),
      column
    );

    if (isExist) {
      await queryInterface.removeColumn(
        PurchaseOrderProduct.getTableName(),
        column
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      PurchaseOrderProduct.getTableName(),
      column
    );

    if (!isExist) {
      await queryInterface.addColumn(
        PurchaseOrderProduct.getTableName(),
        column,
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );
    }
  },
};
