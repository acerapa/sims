"use strict";

const { isColumnExistInTable } = require("../models");
const SalesOrderProduct = require("../models/junction/sales-order-product");
const column = "description";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      SalesOrderProduct.getTableName(),
      column
    );

    if (isExist) {
      await queryInterface.removeColumn(
        SalesOrderProduct.getTableName(),
        column
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      SalesOrderProduct.getTableName(),
      column
    );

    if (!isExist) {
      await queryInterface.addColumn(SalesOrderProduct.getTableName(), column, {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
