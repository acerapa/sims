"use strict";

const { areColumnsExistInTable } = require("../models");
const Invoice = require("../models/invoice");
const columns = ["customer_id", "employee_id"];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const areColumnsExist = await areColumnsExistInTable(
      Invoice.getTableName(),
      columns
    );

    if (!areColumnsExist["customer_id"]) {
      await queryInterface.addColumn(
        Invoice.getTableName(),
        "customer_id",
        Invoice.getAttributes()["customer_id"]
      );
    }

    if (!areColumnsExist["employee_id"]) {
      await queryInterface.addColumn(
        Invoice.getTableName(),
        "employee_id",
        Invoice.getAttributes()["employee_id"]
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const areColumnsExist = await areColumnsExistInTable(
      Invoice.getTableName(),
      columns
    );

    if (areColumnsExist["customer_id"]) {
      await queryInterface.removeColumn(Invoice.getTableName(), "customer_id");
    }

    if (areColumnsExist["employee_id"]) {
      await queryInterface.removeColumn(Invoice.getTableName(), "employee_id");
    }
  },
};
