"use strict";

const ProductSettings = require("../models/product-setting");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      ProductSettings.getTableName(),
      ProductSettings.getAttributes()
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(ProductSettings.getTableName());
  },
};
