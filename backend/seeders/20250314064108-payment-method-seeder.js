"use strict";

const { basename } = require("path");
const PaymentMethod = require("../models/payment-method");
const {
  checkIfSeederExecuted,
  registerSeederExecution,
  getSeederExecution,
  removeSeederExecution,
} = require("./misc/SeederHelpers");
const { removeConstraints } = require("../models");
const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isExecuted = await checkIfSeederExecuted(basename(__filename));
    if (!isExecuted) {
      const paymentMethods = [
        {
          name: "Cash",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Credit Card",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Debit Card",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Checks",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const res = await PaymentMethod.bulkCreate(paymentMethods);
      await registerSeederExecution(
        basename(__filename),
        res.map((pm) => pm.id),
        true
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // remove constraints
    await removeConstraints(PaymentMethod.getTableName(), queryInterface);

    const seeder = await getSeederExecution(basename(__filename));
    if (seeder) {
      await PaymentMethod.destroy({
        where: {
          id: {
            [Op.in]: seeder.data,
          },
        },
      });
    }

    await removeSeederExecution(basename(__filename));
  },
};
