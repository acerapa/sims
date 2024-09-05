"use strict";

const { isColumnExistInTable } = require("../models");
const PhysicalInventoryItem = require("../models/physical-inventory-item");

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
      "name"
    );
    if (!isExist) {
      await queryInterface.addColumn(
        PhysicalInventoryItem.tableName,
        "name",
        PhysicalInventoryItem.getAttributes()["name"]
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
      "name"
    );

    if (isExist) {
      await queryInterface.removeColumn(
        PhysicalInventoryItem.tableName,
        "name"
      );
    }
  },
};
