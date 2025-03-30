"use strict";

const { isColumnExistInTable } = require("../models");
const SalesOrder = require("../models/sales-order");
const column = "has_delivery";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const exist = await isColumnExistInTable(SalesOrder.getTableName(), column);

    const hasDeliveryAttribute = SalesOrder.getAttributes()[column];

    if (!exist && hasDeliveryAttribute) {
      await queryInterface.addColumn(
        SalesOrder.getTableName(),
        column,
        hasDeliveryAttribute
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const exist = await isColumnExistInTable(SalesOrder.getTableName(), column);

    if (exist) {
      await queryInterface.removeColumn(SalesOrder.getTableName(), column);
    }
  },
};
