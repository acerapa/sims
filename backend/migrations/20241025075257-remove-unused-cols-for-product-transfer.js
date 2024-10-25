"use strict";

const ProductTransfer = require("../models/product-transfer");
const { areColumnsExistInTable } = require("../models");
const { ProductTransferStatus } = require("shared/enums");
const columns = ["status", "quantity_received", "remarks"];
const tableName = ProductTransfer.getTableName();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const areExists = await areColumnsExistInTable(tableName, columns);

    if (areExists["status"]) {
      await queryInterface.removeColumn(tableName, "status");
    }

    if (areExists["quantity_received"]) {
      await queryInterface.removeColumn(tableName, "quantity_received");
    }

    if (areExists["remarks"]) {
      await queryInterface.removeColumn(tableName, "remarks");
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // For now nothing to do
    const areExists = await areColumnsExistInTable(tableName, columns);

    if (!areExists["status"]) {
      await queryInterface.addColumn(tableName, "status", {
        type: Sequelize.ENUM,
        values: Object.values(ProductTransferStatus),
        defaultValue: ProductTransferStatus.OPEN,
      });
    }

    if (!areExists["quantity_received"]) {
      await queryInterface.addColumn(tableName, "quantity_received", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!areExists["remarks"]) {
      await queryInterface.addColumn(tableName, "remarks", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
