'use strict';
const Account = require('../models/account');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Account.getTableName(), Account.getAttributes() );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(Account.getTableName());
  }
};