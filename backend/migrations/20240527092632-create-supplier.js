"use strict";
const { removeConstraints } = require("../models");
const Supplier = require("../models/supplier");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      Supplier.getTableName(),
      Supplier.getAttributes()
    );
  },
  async down(queryInterface, Sequelize) {
    // remove constraints
    await removeConstraints(Supplier.getTableName(), queryInterface);
    await queryInterface.dropTable(Supplier.getTableName());
  },
};
