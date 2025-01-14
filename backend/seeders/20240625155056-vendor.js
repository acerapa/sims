"use strict";

const { basename } = require("path");
const Address = require("../models/address");
const { Supplier } = require("../models/association");
const suppliersDummyData = require("./dummy/vendors");
const {
  checkIfSeederExecuted,
  registerSeederExecution,
  removeSeederExecution,
  getSeederExecution,
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

    const isExecuted = await checkIfSeederExecuted(basename(__filename));
    if (!isExecuted) {
      const res = await Supplier.bulkCreate(suppliersDummyData, {
        include: {
          model: Address,
          as: "address",
        },
      });

      await registerSeederExecution(
        basename(__filename),
        res.map((s) => s.id),
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
      await Supplier.destroy({
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
