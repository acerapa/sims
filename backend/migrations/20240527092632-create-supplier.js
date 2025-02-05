"use strict";
const { getColumnConstrains } = require("../models");
const Supplier = require("../models/supplier");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      Supplier.getTableName(),
      Supplier.getAttributes()
    );
  },
  async down(queryInterface, Sequelize) {
    const constraints = await getColumnConstrains(Supplier.getTableName());
    if (constraints.length) {
      await Promise.all(
        constraints.map((cnt) =>
          queryInterface.removeConstraint(cnt.tableName, cnt.constraintName)
        )
      );
    }
    await queryInterface.dropTable(Supplier.getTableName());
  },
};
