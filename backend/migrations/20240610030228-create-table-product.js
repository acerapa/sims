"use strict";

const { removeConstraints } = require("../models");
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
    await queryInterface.createTable(
      Product.getTableName(),
      Product.getAttributes()
    );
  },

  async down(queryInterface, Sequelize) {
    // remove constraints
    await removeConstraints(Product.getTableName(), queryInterface);
    await queryInterface.dropTable(Product.getTableName());
  },
};
