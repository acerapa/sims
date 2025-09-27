"use strict";

const { setForeignKeyChecks, removeConstraints } = require("../models");
const Invoice = require("../models/invoice");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      Invoice.getTableName(),
      Invoice.getAttributes(),
    );
  },

  async down(queryInterface, Sequelize) {
    // set foreign key checks to false
    await removeConstraints(Invoice.getTableName(), queryInterface);
    await queryInterface.dropTable(Invoice.getTableName());
  },
};
