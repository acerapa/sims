"use strict";
const { areColumnsExistInTable } = require("../models");
const PhysicalInventory = require("../models/physical-inventory");

const tableName = PhysicalInventory.getTableName();
const attributes = PhysicalInventory.getAttributes();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const areColumnsExist = await areColumnsExistInTable(tableName, [
      "quantity",
      "inventory_incharge",
      "branch_manager",
      "time_start",
      "time_end",
    ]);
    if (!areColumnsExist["quantity"]) {
      await queryInterface.addColumn(
        tableName,
        "quantity",
        attributes["quantity"]
      );
    }
    if (!areColumnsExist["inventory_incharge"]) {
      await queryInterface.addColumn(
        tableName,
        "inventory_incharge",
        attributes["inventory_incharge"]
      );
    }
    if (!areColumnsExist["branch_manager"]) {
      await queryInterface.addColumn(
        tableName,
        "branch_manager",
        attributes["branch_manager"]
      );
    }
    if (!areColumnsExist["time_start"]) {
      await queryInterface.addColumn(
        tableName,
        "time_start",
        attributes["time_start"]
      );
    }
    if (!areColumnsExist["time_end"]) {
      await queryInterface.addColumn(
        tableName,
        "time_end",
        attributes["time_end"]
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

    const areColumnsExist = await areColumnsExistInTable(tableName, [
      "quantity",
      "inventory_incharge",
      "branch_manager",
      "time_start",
      "time_end",
    ]);
    if (areColumnsExist["quantity"]) {
      await queryInterface.removeColumn(tableName, "quantity");
    }
    if (areColumnsExist["inventory_incharge"]) {
      await queryInterface.removeColumn(tableName, "inventory_incharge");
    }
    if (areColumnsExist["branch_manager"]) {
      await queryInterface.removeColumn(tableName, "branch_manager");
    }
    if (areColumnsExist["time_start"]) {
      await queryInterface.removeColumn(tableName, "time_start");
    }
    if (areColumnsExist["time_end"]) {
      await queryInterface.removeColumn(tableName, "time_end");
    }
  },
};
