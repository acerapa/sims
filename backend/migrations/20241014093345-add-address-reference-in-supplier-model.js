"use strict";

const { isColumnExistInTable } = require("../models");
const Supplier = require("../models/supplier");

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
      Supplier.getTableName(),
      "address_id"
    );

    if (!isExist) {
      await queryInterface.addColumn(
        Supplier.getTableName(),
        "address_id",
        Supplier.getAttributes()["address_id"]
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

    const isExist = isColumnExistInTable(Supplier.getTableName(), "address_id");

    if (isExist) {
      await queryInterface.removeColumn(Supplier.getTableName(), "address_id");
    }
  },
};
