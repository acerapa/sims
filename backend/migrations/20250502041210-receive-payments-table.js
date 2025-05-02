"use strict";

const ReceivePayment = require("../models/receive-payment");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      ReceivePayment.tableName,
      ReceivePayment.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(ReceivePayment.tableName);
  },
};
