"use strict";

const branchData = require("./dummy/branches");
const Branch = require("../models/branch");
const Address = require("../models/address");
const User = require("../models/user");

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

    await Branch.bulkCreate(await branchData.generateBranchDummy(), {
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
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
