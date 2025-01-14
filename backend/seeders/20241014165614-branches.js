"use strict";

const { basename } = require("path");
const branchData = require("./dummy/branches");
const Branch = require("../models/branch");
const Address = require("../models/address");
const User = require("../models/user");
const {
  checkIfSeederExecuted,
  registerSeederExecution,
  getSeederExecution,
  removeSeederExecution,
} = require("./misc/SeederHelpers");

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
      const res = await Branch.bulkCreate(
        await branchData.generateBranchDummy(),
        {
          include: [
            {
              model: Address,
              as: "address",
            },
            {
              model: User,
              as: "manager",
            },
          ],
        }
      );

      await registerSeederExecution(
        basename(__filename),
        res.map((r) => r.id),
        true
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const seeder = await getSeederExecution(basename(__filename));
    if (seeder) {
      await Branch.destroy({
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
