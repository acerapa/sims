"use strict";
const Delivery = require("../models/delivery");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      Delivery.getTableName(),
      Delivery.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(Delivery.getTableName());
  },
};
