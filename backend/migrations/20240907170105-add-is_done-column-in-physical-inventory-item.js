"use strict";

const { isColumnExistInTable } = require("../models");
const PhysicalInventoryItem = require("../models/physical-inventory-item");
const col = "is_done";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const isExist = await isColumnExistInTable(
      PhysicalInventoryItem.tableName,
      col
    );

    if (!isExist) {
      await queryInterface.addColumn(
        PhysicalInventoryItem.tableName,
        col,
        PhysicalInventoryItem.getAttributes()[col]
      );
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    const isExist = await isColumnExistInTable(
      PhysicalInventoryItem.tableName,
      col
    );

    if (isExist) {
      await queryInterface.removeColumn(PhysicalInventoryItem.tableName, col);
    }
  },
};
