"use strict";

const InvoiceProducts = require("../models/junction/invoice-products");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      InvoiceProducts.getTableName(),
      InvoiceProducts.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(InvoiceProducts.getTableName());
  },
};
