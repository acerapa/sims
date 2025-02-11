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

    const isTableExist = await queryInterface.tableExists("product_transfer");

    if (isTableExist) {
      await removeConstraints("product_transfer", queryInterface);
      await queryInterface.dropTable("product_transfer");
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
