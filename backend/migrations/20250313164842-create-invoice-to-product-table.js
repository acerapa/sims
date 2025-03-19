"use strict";

const InvoiceToProducts = require("../models/junction/invoice-to-products");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      InvoiceToProducts.getTableName(),
      InvoiceToProducts.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(InvoiceToProducts.getTableName());
  },
};
