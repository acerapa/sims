"use strict";

const { InvoiceStatus } = require("shared/enums");
const { isColumnExistInTable } = require("../models");
const ReceivedPayment = require("../models/received-payment");
const column = "invoice_status";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      ReceivedPayment.getTableName(),
      column
    );

    if (!isExist) {
      await queryInterface.addColumn(ReceivedPayment.getTableName(), column, {
        type: Sequelize.ENUM,
        values: Object.values(InvoiceStatus),
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      ReceivedPayment.getTableName(),
      column
    );

    if (isExist) {
      await queryInterface.removeColumn(ReceivedPayment.getTableName(), column);
    }
  },
};
