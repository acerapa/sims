"use strict";

const { basename } = require("path");
const categories = require("./dummy/product-categories");
const { ProductCategory } = require("../models/association");

const {
  checkIfSeederExecuted,
  registerSeederExecution,
  getSeederExecution,
  removeSeederExecution,
} = require("./misc/SeederHelpers");
const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExecuted = await checkIfSeederExecuted(basename(__filename));
    console.log("isExecuted", isExecuted);
    if (!isExecuted) {
      const res = await Promise.all(
        categories.map((category) => {
          return ProductCategory.create(category, {
            include: [
              {
                model: ProductCategory,
                as: "sub_categories",
              },
            ],
          });
        })
      );

      await registerSeederExecution(
        basename(__filename),
        res.map((r) => r.id),
        true
      );
    } else {
      console.log("Seeder already executed");
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const seeder = await getSeederExecution(basename(__filename));
    if (seeder) {
      await ProductCategory.destroy({
        where: {
          id: {
            [Op.in]: seeder.data,
          },
        },
      });

      await removeSeederExecution(basename(__filename));
    }
  },
};
