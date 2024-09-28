"use strict";

const ProductSetting = require("../models/product-setting");

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
    const data = [
      { point: 12, createdAt: new Date(), updatedAt: new Date() },
      { point: 13, createdAt: new Date(), updatedAt: new Date() },
      { point: 15, createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert(ProductSetting.getTableName(), data);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(ProductSetting.getTableName(), null, {});
  },
};
