'use strict';
const ProductCategory = require('../models/product-category');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(ProductCategory.getTableName(), ProductCategory.getAttributes());
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(ProductCategory.getTableName());
  }
};