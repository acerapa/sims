"use strict";

const PhysicalInventoryAdjustments = require("../models/physical-inventory-adjustments");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      PhysicalInventoryAdjustments.getTableName(),
      PhysicalInventoryAdjustments.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(PhysicalInventoryAdjustments.getTableName());
  },
};
