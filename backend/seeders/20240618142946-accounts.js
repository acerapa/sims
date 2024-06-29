"use strict";

const Account = require("../models/account");

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

    await queryInterface.bulkInsert(Account.getTableName(), fields);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(Account.getTableName(), null, {});
  },
};
