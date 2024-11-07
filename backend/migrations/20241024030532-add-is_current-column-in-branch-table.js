"use strict";

const { isColumnExistInTable } = require("../models");
const Branch = require("../models/branch");
const column = "is_current";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const isExist = await isColumnExistInTable(Branch.getTableName(), column);

    if (!isExist) {
      await queryInterface.addColumn(
        Branch.getTableName(),
        column,
        Branch.getAttributes()[column]
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

    const isExist = await isColumnExistInTable(Branch.getTableName(), column);

    if (isExist) {
      await queryInterface.removeColumn(Branch.getTableName(), column);
    }
  },
};
