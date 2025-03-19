"use strict";

const PaymentMethod = require("../models/payment-method");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      PaymentMethod.tableName,
      PaymentMethod.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(PaymentMethod.tableName);
  },
};
