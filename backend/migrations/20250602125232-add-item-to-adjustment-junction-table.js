"use strict";

const ItemToAdjustments = require("../models/junction/item-to-adjustments");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      ItemToAdjustments.getTableName(),
      ItemToAdjustments.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(ItemToAdjustments.getTableName());
  },
};
