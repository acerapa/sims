"use strict";
const { areColumnsExistInTable } = require("../models");
const ProductCategory = require("../models/product-category");
const tableName = ProductCategory.getTableName();
const attributes = ProductCategory.getAttributes();

const columns = Object.freeze({
  is_sub: "is_sub",
  general_cat: "general_cat",
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const areColumnExist = await areColumnsExistInTable(
      tableName,
      Object.values(columns)
    );

    if (!areColumnExist[columns.is_sub]) {
      await queryInterface.addColumn(
        tableName,
        columns.is_sub,
        attributes[columns.is_sub]
      );
    }

    if (!areColumnExist[columns.general_cat]) {
      await queryInterface.addColumn(
        tableName,
        columns.general_cat,
        attributes[columns.general_cat]
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

    const areColumnExist = await areColumnsExistInTable(
      tableName,
      Object.values(columns)
    );

    if (!areColumnExist[columns.is_sub]) {
      await queryInterface.removeColumn(tableName);
    }

    if (!areColumnExist[columns.general_cat]) {
      await queryInterface.removeColumn(tableName);
    }
  },
};
