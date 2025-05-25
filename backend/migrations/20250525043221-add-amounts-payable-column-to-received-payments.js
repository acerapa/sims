"use strict";

const { isColumnExistInTable } = require("../models");
const ReceivedPayment = require("../models/received-payment");
const column = "amounts_payable";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExists = await isColumnExistInTable(
      ReceivedPayment.getTableName(),
      column
    );
    if (!isExists) {
      await queryInterface.addColumn(ReceivedPayment.getTableName(), column, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const isExists = await isColumnExistInTable(
      ReceivedPayment.getTableName(),
      column
    );

    if (isExists) {
      await queryInterface.removeColumn(ReceivedPayment.getTableName(), column);
    }
  },
};
