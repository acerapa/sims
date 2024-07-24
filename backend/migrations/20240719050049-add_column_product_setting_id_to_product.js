"use strict";

const { isColumnExistInTable } = require("../models");
const Product = require("../models/product");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const isExist = await isColumnExistInTable(Product.getTableName(), 'product_setting_id', Product.getAttributes().product_setting_id);
    if (!isExist) {
      await queryInterface.addColumn(Product.getTableName(), 'product_setting_id', Product.getAttributes().product_setting_id);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(Product.getTableName(), 'product_setting_id');
  },
};
