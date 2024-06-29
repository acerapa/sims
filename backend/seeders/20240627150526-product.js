'use strict';
const path = require("path");

const base_path = path.dirname(__dirname)

const Product = require(base_path + "/models/product");
const Supplier = require(base_path + "/models/supplier");
const { getProducts } = require(base_path + "/seeders/dummy/products");

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
    const products = await getProducts();
    await Product.bulkCreate(products, {
      include: [
        {
          model: Supplier,
          as: "suppliers"
        }
      ]
    });
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete(Product.getTableName(), null, {});
  }
};
