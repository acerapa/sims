"use strict";

const User = require("../models/user");
const bcryptJS = require("bcryptjs");

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
        password: await bcryptJS.hash("admin123", 10),
        first_name: "Harlan",
        last_name: "Doe",
        middle_name: "",
        date_started: new Date(),
        position: "admin",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
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
