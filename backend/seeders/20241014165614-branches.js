"use strict";

const { basename } = require("path");
const branchData = require("./dummy/branches");
const { Branch } = require("../models/association");
const Address = require("../models/address");
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
    const isExecuted = await checkIfSeederExecuted(basename(__filename));
    if (!isExecuted) {
      const data = await branchData.generateBranchDummy();
      const res = await Branch.bulkCreate(data, {
        include: [
          {
            model: Address,
            as: "address",
          },
        ],
      });

      await Promise.all(
        res.map((b, ndx) => {
          return b.update({ branch_manager: data[ndx].manager });
        })
      );

      await registerSeederExecution(
        basename(__filename),
        {
          branch_ids: res.map((r) => r.id),
          address_ids: res.map((r) => r.address_id),
        },
        true
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // remove constaints
    await removeConstraints(Branch.getTableName(), queryInterface);

    const seeder = await getSeederExecution(basename(__filename));
    if (seeder) {
      await Branch.destroy({
        where: {
          id: {
            [Op.in]: seeder.data.branch_ids,
          },
        },
      });

      // this will be temporary
      await Address.destroy({
        where: {
          id: {
            [Op.in]: seeder.data.address_ids,
          },
        },
      });

      await removeSeederExecution(basename(__filename));
    }
  },
};
