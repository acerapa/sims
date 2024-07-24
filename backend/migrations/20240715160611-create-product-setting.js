"use strict";

const ProductSettings = require("../models/product-setting");
const Product = require("../models/product");
const { isColumnExistInTable } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      ProductSettings.getTableName(),
      ProductSettings.getAttributes()
    );

    // await isColumnExistInTable(Product.getTableName(), "id");

    // throw Error("Should not proceed!");
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(ProductSettings.getTableName());
  },
};
