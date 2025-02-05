"use strict";

const { getColumnConstrains } = require("../models");
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    const constraints = await getColumnConstrains(Branch.getTableName());

    if (constraints.length) {
      await Promise.all(
        constraints.map((cnt) => {
          queryInterface.removeConstraint(cnt.tableName, cnt.constraintName);
        })
      );
    }

    await queryInterface.dropTable(Branch.getTableName());
  },
};
