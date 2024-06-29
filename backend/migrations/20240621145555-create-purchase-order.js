'use strict';

const PurchaseOrder = require('../models/purchase-order');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(PurchaseOrder.getTableName(), PurchaseOrder.getAttributes());
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(PurchaseOrder.getTableName());
  }
};