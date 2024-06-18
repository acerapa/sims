'use strict';

const Account = require('../models/account');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
      name: "Cost of Goods",
      type: "expense",
      createdAt: new Date()
    },
    {
      name: "Sales of Goods",
      type: "income",
      createdAt: new Date()
    }
   ];

   await queryInterface.bulkInsert(Account.getTableName(), fields);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete(Account.getTableName(), null, {});
  }
};
