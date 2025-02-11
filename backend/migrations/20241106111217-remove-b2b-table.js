"use strict";

const { removeConstraints } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const isTableExist = await queryInterface.tableExists("B2BTransfers");
    if (isTableExist) {
      await removeConstraints("B2BTransfers", queryInterface);
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
