"use strict";

const { basename } = require("path");
const Account = require("../models/account");
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
    const fields = [
      {
        name: "Hardware",
        type: "income",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Software",
        type: "income",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Services",
        type: "income",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Others",
        type: "income",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rentals",
        type: "expense",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Travel",
        type: "expense",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mail Allowance",
        type: "expense",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const isExecuted = await checkIfSeederExecuted(basename(__filename));
    console.log("isExecuted", isExecuted);
    if (!isExecuted) {
      const res = await Account.bulkCreate(fields);

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
      await Account.destroy({
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
