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
const ProductDetails = require("../models/product-details");
const { removeConstraints, setForeignKeyChecks } = require("../models");
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
          const prd = await Product.create(product, {
            include: {
              model: ProductDetails,
              as: "product_details",
            },
          });
          product_ids.push(prd.id);
          return Promise.all([
            ...products[ndx].suppliers.map((s) =>
              prd.addSupplier(s.id, {
                through: {
                  cost: s.cost,
                },
              })
            ),
            ...products[ndx].categories.map((c) => {
              return prd.addCategory(c);
            }),
          ]);
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
    await removeConstraints(Product.getTableName(), queryInterface);

    // force to remove all the data
    await setForeignKeyChecks(0);

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

    await setForeignKeyChecks(1);
  },
};
