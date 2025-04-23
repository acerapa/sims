"use strict";

const { areColumnsExistInTable } = require("../models");
const SalesOrder = require("../models/sales-order");
const columns = ["sub_total", "total", "total_discount"];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const areColumnsExist = await areColumnsExistInTable(
      SalesOrder.getTableName(),
      columns
    );

    if (!areColumnsExist["sub_total"]) {
      await queryInterface.addColumn(
        SalesOrder.getTableName(),
        "sub_total",
        SalesOrder.getAttributes()["sub_total"]
      );
    }

    if (!areColumnsExist["total"]) {
      await queryInterface.addColumn(
        SalesOrder.getTableName(),
        "total",
        SalesOrder.getAttributes()["total"]
      );
    }

    if (!areColumnsExist["total_discount"]) {
      await queryInterface.addColumn(
        SalesOrder.getTableName(),
        "total_discount",
        SalesOrder.getAttributes()["total_discount"]
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const areColumnsExist = await areColumnsExistInTable(
      SalesOrder.getTableName(),
      columns
    );

    if (areColumnsExist["sub_total"]) {
      await queryInterface.removeColumn(SalesOrder.getTableName(), "sub_total");
    }

    if (areColumnsExist["total"]) {
      await queryInterface.removeColumn(SalesOrder.getTableName(), "total");
    }

    if (areColumnsExist["total_discount"]) {
      await queryInterface.removeColumn(
        SalesOrder.getTableName(),
        "total_discount"
      );
    }
  },
};
