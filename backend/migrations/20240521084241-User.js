"use strict";

const { removeConstraints } = require("../models");
const User = require("../models/user");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable(User.getTableName(), User.getAttributes());
  },

  async down(queryInterface, Sequelize) {
    // remove constraints
    await removeConstraints(User.getTableName(), queryInterface);
    await queryInterface.dropTable(User.getTableName());
  },
};
