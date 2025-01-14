"use strict";
const path = require("path");
const {
  checkIfSeederExecuted,
  registerSeederExecution,
  getSeederExecution,
  removeSeederExecution,
} = require("./misc/SeederHelpers");

const base_path = path.dirname(__dirname);

const Product = require("../models/product");
const { Op } = require("sequelize");
const { getProducts } = require(base_path + "/seeders/dummy/products");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExecuted = await checkIfSeederExecuted(path.basename(__filename));
    if (!isExecuted) {
      const product_ids = [];
      const products = await getProducts();

      await Promise.all(
        products.map(async (product, ndx) => {
          const prd = await Product.create(product);
          product_ids.push(prd.id);
          return Promise.all(
            products[ndx].suppliers.map((s) =>
              prd.addSupplier(s.id, {
                through: {
                  cost: s.cost,
                },
              })
            )
          );
        })
      );

      await registerSeederExecution(
        path.basename(__filename),
        product_ids,
        true
      );
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    const seeder = await getSeederExecution(path.basename(__filename));
    if (seeder) {
      await Product.destroy({
        where: {
          id: {
            [Op.in]: seeder.data,
          },
        },
      });

      await removeSeederExecution(path.basename(__filename));
    }
  },
};
