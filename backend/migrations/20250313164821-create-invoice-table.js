"use strict";

const Invoice = require("../models/invoice");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      Invoice.getTableName(),
      Invoice.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(Invoice.getTableName());
  },
};
