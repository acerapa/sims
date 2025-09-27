"use strict";

const PurchaseOrder = require("../models/purchase-order");
const column = "bill_due";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(PurchaseOrder.getTableName(), column, {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(PurchaseOrder.getTableName(), column, {
      type: Sequelize.DataTypes.DATE,
      allowNull: false
    });
  },
};
