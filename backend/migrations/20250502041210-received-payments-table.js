"use strict";

const ReceivedPayment = require("../models/received-payment");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      ReceivedPayment.tableName,
      ReceivedPayment.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(ReceivedPayment.tableName);
  },
};
