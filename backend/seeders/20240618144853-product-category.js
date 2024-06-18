'use strict';

const ProductCategory = require('../models/product-category');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
        name: "Laptop",
        createdAt: new Date()
      },
      {
        name: "Printers",
        createdAt: new Date()
      },
      {
        name: "Monitors",
        createdAt: new Date()
      },
      {
        name: "Smart Phones",
        createdAt: new Date()
      },
      {
        name: "Services",
        createdAt: new Date()
      }
    ];

    await queryInterface.bulkInsert(ProductCategory.getTableName(), fields, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete(ProductCategory.getTableName(), null, {});
  }
};
