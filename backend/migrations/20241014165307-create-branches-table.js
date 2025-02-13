"use strict";

const { removeConstraints } = require("../models");
const Branch = require("../models/branch");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable(
      Branch.getTableName(),
      Branch.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    // remove constraints
    await removeConstraints(Branch.getTableName(), queryInterface);
    await queryInterface.dropTable(Branch.getTableName());
  },
};
