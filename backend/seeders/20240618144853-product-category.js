"use strict";

const ProductCategory = require("../models/product-category");

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

    const fields = [
      {
        name: "Laptops",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Printers",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Monitors",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Smart Phones",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Services",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mouses",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert(ProductCategory.getTableName(), fields, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(ProductCategory.getTableName(), null, {});
  },
};
