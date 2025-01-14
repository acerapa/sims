"use strict";

const { basename } = require("path");
const ProductSetting = require("../models/product-setting");
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

    const isExecuted = await checkIfSeederExecuted(basename(__filename));
    if (!isExecuted) {
      const res = await ProductSetting.bulkCreate(data);

      await registerSeederExecution(
        basename(__filename),
        res.map((r) => r.id),
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

    const seeder = await getSeederExecution(basename(__filename));

    if (seeder) {
      await ProductSetting.destroy({
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
