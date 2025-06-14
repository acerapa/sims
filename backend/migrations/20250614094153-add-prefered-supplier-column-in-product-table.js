"use strict";

const { isColumnExistInTable } = require("../models");

const Product = require("../models/product");
const Supplier = require("../models/supplier");

const column = "pref_sup_id";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExists = await isColumnExistInTable(Product.getTableName(), column);

    if (!isExists) {
      await queryInterface.addColumn(Product.getTableName(), column, {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: Supplier.getTableName(),
          key: "id",
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const isExists = await isColumnExistInTable(Product.getTableName(), column);

    if (isExists) {
      await queryInterface.removeColumn(Product.getTableName(), column);
    }
  },
};
