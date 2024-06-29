"use strict";

const Address = require("../models/address");
const Supplier = require("../models/supplier");
const suppliersDummyData = require("./dummy/vendors");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await Supplier.bulkCreate(suppliersDummyData, {
      include: [
        {
          model: Address,
          as: "address",
        },
      ],
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(Supplier.getTableName(), null, {});
  },
};
