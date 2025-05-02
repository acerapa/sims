"use strict";
const { basename } = require("path");
const Customer = require("../models/customer");
const {
  checkIfSeederExecuted,
  registerSeederExecution,
  getSeederExecution,
  removeSeederExecution,
} = require("./misc/SeederHelpers");
const { ConsoleColors } = require("shared/enums");
const customerDummy = require("./dummy/customers");
const { Op } = require("sequelize");
const { removeConstraints, setForeignKeyChecks } = require("../models");
const Address = require("../models/address");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExecuted = await checkIfSeederExecuted(basename(__filename));
    console.log(
      `${ConsoleColors.BLUE}Is Executed: ${isExecuted}${ConsoleColors.RESET}`
    );
    if (!isExecuted) {
      const res = await Customer.bulkCreate(customerDummy, {
        include: [
          {
            model: Address,
            as: "address",
          },
        ],
      });
      console.log(
        `${ConsoleColors.GREEN}Seeder Executed: ${res}${ConsoleColors.RESET}`
      );
      await registerSeederExecution(
        basename(__filename),
        res.map((c) => c.id),
        true
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // remove constaints
    await removeConstraints(Customer.getTableName(), queryInterface);

    // force to remove all the data
    await setForeignKeyChecks(0);

    const seeder = await getSeederExecution(basename(__filename));
    if (seeder) {
      await Customer.destroy({
        where: {
          id: {
            [Op.in]: seeder.data,
          },
        },
      });

      await removeSeederExecution(basename(__filename));
    }

    await setForeignKeyChecks(1);
  },
};
