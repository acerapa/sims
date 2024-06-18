'use strict';

const Transaction = require('../models/transaction');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Transaction.getTableName(), Transaction.getAttributes());
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(Transaction.getTableName());
  }
};