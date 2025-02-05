"use strict";

const { getColumnConstrains } = require("../models");
const User = require("../models/user");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable(User.getTableName(), User.getAttributes());
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    const constraints = await getColumnConstrains(User.getTableName());
    if (constraints.length) {
      await Promise.all(
        constraints.map((cnt) =>
          queryInterface.removeConstraint(cnt.tableName, cnt.constraintName)
        )
      );
    }

    await queryInterface.dropTable(User.getTableName());
  },
};
