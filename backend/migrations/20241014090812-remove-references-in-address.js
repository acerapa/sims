"use strict";

const Address = require("../models/address");
const Supplier = require("../models/supplier");
const PurchaseOrder = require("../models/purchase-order");
const { areColumnsExistInTable } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const areColumnsExist = await areColumnsExistInTable(
      Address.getTableName(),
      ["supplier_id", "order_id"]
    );

    if (areColumnsExist["supplier_id"]) {
      await queryInterface.removeColumn(Address.getTableName(), "supplier_id");
    }

    if (areColumnsExist["order_id"]) {
      await queryInterface.removeColumn(Address.getTableName(), "order_id");
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    // const areColumnsExist = await areColumnsExistInTable(
    //   Address.getTableName(),
    //   ["supplier_id", "order_id"]
    // );

    // if (!areColumnsExist["supplier_id"]) {
    //   await queryInterface.addColumn(Address.getTableName(), "supplier_id", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: Supplier,
    //       key: "id",
    //     },
    //     allowNull: true,
    //   });
    // }

    // if (!areColumnsExist["order_id"]) {
    //   await queryInterface.addColumn(Address.getTableName(), "order_id", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: PurchaseOrder,
    //       key: "id",
    //     },
    //   });
    // }
  },
};
