"use strict";

const { isColumnExistInTable } = require("../models");
const Notification = require("../models/notification");
const columnName = "type";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      Notification.getTableName(),
      columnName
    );

    if (!isExist) {
      await queryInterface.addColumn(
        Notification.getTableName(),
        columnName,
        Notification.getAttributes()[columnName]
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const isExist = await isColumnExistInTable(
      Notification.getTableName(),
      columnName
    );

    if (isExist)
      await queryInterface.removeColumn(
        Notification.getTableName(),
        columnName
      );
  },
};
