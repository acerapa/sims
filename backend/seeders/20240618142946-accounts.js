"use strict";

const { basename } = require("path");
const Account = require("../models/account");
const fields = require("./dummy/accounts");
const {
  checkIfSeederExecuted,
  registerSeederExecution,
  getSeederExecution,
  removeSeederExecution,
} = require("./misc/SeederHelpers");
const { Op } = require("sequelize");
const { removeConstraints } = require("../models");

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
    // remove constaints
    await removeConstraints(Account.getTableName(), queryInterface);

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
