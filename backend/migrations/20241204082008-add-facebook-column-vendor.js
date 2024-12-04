"use strict";

const { isColumnExistInTable } = require("../models");
const Supplier = require("../models/supplier");
const table = Supplier.getTableName();
const attributes = Supplier.getAttributes();
const column = "fb_profile";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(table, column);
    if (!isExist) {
      await queryInterface.addColumn(table, column, attributes[column]);
    }
  },

  async down(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(table, column);
    if (isExist) {
      await queryInterface.removeColumn(table, column);
    }
  },
};
