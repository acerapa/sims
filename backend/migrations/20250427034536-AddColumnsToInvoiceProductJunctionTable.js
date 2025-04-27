"use strict";

const { areColumnsExistInTable } = require("../models");
const InvoiceProduct = require("../models/junction/invoice-products");
const columns = ["serial_number", "discount"];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const areColumnsExist = await areColumnsExistInTable(
      InvoiceProduct.getTableName(),
      columns
    );

    if (!areColumnsExist["serial_number"]) {
      await queryInterface.addColumn(
        InvoiceProduct.getTableName(),
        "serial_number",
        InvoiceProduct.getAttributes()["serial_number"]
      );
    }

    if (!areColumnsExist["discount"]) {
      await queryInterface.addColumn(
        InvoiceProduct.getTableName(),
        "discount",
        InvoiceProduct.getAttributes()["discount"]
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const areColumnsExist = await areColumnsExistInTable(
      InvoiceProduct.getTableName(),
      columns
    );

    if (areColumnsExist["serial_number"]) {
      await queryInterface.removeColumn(
        InvoiceProduct.getTableName(),
        "serial_number"
      );
    }

    if (areColumnsExist["discount"]) {
      await queryInterface.removeColumn(
        InvoiceProduct.getTableName(),
        "discount"
      );
    }
  },
};
