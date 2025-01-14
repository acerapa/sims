"use strict";

const { basename } = require("path");
const User = require("../models/user");
const bcryptJS = require("bcryptjs");
const {
  checkIfSeederExecuted,
  registerSeederExecution,
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
      const fields = [
        {
          username: "admin",
          password: await bcryptJS.hash("admin123", 10),
          first_name: "Harlan",
          last_name: "Doe",
          middle_name: "",
          date_started: new Date(),
          position: "admin",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "cashier",
          password: await bcryptJS.hash("cashier", 10),
          first_name: "Mell",
          last_name: "Doe",
          middle_name: "",
          date_started: new Date(),
          position: "cashier",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const res = await User.bulkCreate(fields);

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
      await User.destroy({
        where: {
          id: {
            [Op.in]: seeder.data,
          },
        },
      });
    }
  },
};
