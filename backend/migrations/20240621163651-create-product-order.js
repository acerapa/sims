'use strict';

const ProductOrder = require('../models/product-order');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(ProductOrder.getTableName(), ProductOrder.getAttributes());
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(ProductOrder.getTableName());
  }
};