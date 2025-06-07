'use strict';

const { isColumnExistInTable } = require("../models");
const PhysicalInventory = require("../models/physical-inventory")
const column = 'memo'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const isExists = await isColumnExistInTable(PhysicalInventory.getTableName(), column)

    if (!isExists) {
      await queryInterface.addColumn(PhysicalInventory.getTableName(), column, {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      })
    } 
  },

  async down (queryInterface, Sequelize) {
    const isExists = await isColumnExistInTable(PhysicalInventory.getTableName(), column)

    if (isExists) {
      await queryInterface.removeColumn(PhysicalInventory.getTableName(), column)
    }
  }
};
