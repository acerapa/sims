"use strict";

const { areColumnsExistInTable } = require("../models");
const SalesOrderProduct = require("../models/junction/sales-order-product");
const columns = ["discount", "serial_number"];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const areColumnsExist = await areColumnsExistInTable(
      SalesOrderProduct.getTableName(),
      columns
    );

    if (!areColumnsExist["discount"]) {
      await queryInterface.addColumn(
        SalesOrderProduct.getTableName(),
        "discount",
        SalesOrderProduct.getAttributes()["discount"]
      );
    }

    if (!areColumnsExist["serial_number"]) {
      await queryInterface.addColumn(
        SalesOrderProduct.getTableName(),
        "serial_number",
        SalesOrderProduct.getAttributes()["serial_number"]
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const areColumnsExist = await areColumnsExistInTable(
      SalesOrderProduct.getTableName(),
      columns
    );

    if (areColumnsExist["discount"]) {
      await queryInterface.removeColumn(
        SalesOrderProduct.getTableName(),
        "discount"
      );
    }

    if (areColumnsExist["serial_number"]) {
      await queryInterface.removeColumn(
        SalesOrderProduct.getTableName(),
        "serial_number"
      );
    }
  },
};
