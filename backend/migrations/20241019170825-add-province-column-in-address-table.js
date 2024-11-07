"use strict";

const { isColumnExistInTable } = require("../models");
const Address = require("../models/address");
const column = "province";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const isExist = await isColumnExistInTable(Address.getTableName(), column);

    if (!isExist) {
      await queryInterface.addColumn(
        Address.getTableName(),
        column,
        Address.getAttributes()[column]
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

    const isExist = await isColumnExistInTable(Address.getTableName(), column);

    if (isExist) {
      await queryInterface.removeColumn(Address.getTableName(), column);
    }
  },
};
