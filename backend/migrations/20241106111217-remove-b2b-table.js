"use strict";

const { getColumnConstrains } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const constraints = await getColumnConstrains("B2BTransfers");

    const isTableExist = await queryInterface.tableExists("B2BTransfers");
    if (isTableExist) {
      if (constraints.length) {
        await Promise.all(
          constraints.map((cnt) =>
            queryInterface.removeConstraint(cnt.tableName, cnt.constraintName)
          )
        );
      }
      await queryInterface.dropTable("B2BTransfers");
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
