"use strict";

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

    const fields = [
      {
        username: "admin",
        password: "admin123",
        first_name: "Harlan",
        last_name: "Doe",
        middle_name: "",
        date_started: new Date(),
        position: "admin",
        status: 1,
      },
    ];
    await queryInterface.bulkInsert(User.getTableName(), fields, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete(User.getTableName(), null, {});
  },
};
