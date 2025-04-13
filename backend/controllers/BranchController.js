const { sequelize, Sequelize } = require("../models");
const Address = require("../models/address");
const Branch = require("../models/branch");
const User = require("../models/user");

module.exports = {
  all: async (req, res) => {
    try {
      const branches = await Branch.findAll({
        include: [
          {
            model: User,
            as: "manager",
          },
          {
            model: Address,
            as: "address",
          },
        ],
        order: [["updatedAt", "desc"]],
      });

      res.sendResponse({ branches }, "Successfully fetched", 200);
    } catch (e) {
      res.sendError({ e }, "Something wen't wrong!", 400);
    }
  },
  getCurrentBranch: async (req, res) => {
    try {
      const branch = await Branch.findOne({
        where: {
          is_current: true,
        },
        include: {
          model: Address,
          as: "address",
        },
      });

      res.sendResponse({ branch }, "Successfully fetched", 200);
    } catch (error) {
      res.sendError({ error }, "Something wen't wrong!", 400);
    }
  },
  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = {
        ...req.body.validated.branch,
        address: req.body.validated.address,
      };

      const branch = await Branch.create(data, {
        include: [
          {
            model: Address,
            as: "address",
          },
        ],
        transaction,
        raw: true,
      });

      const manager = await User.findOne({
        where: {
          id: branch.dataValues.branch_manager,
        },
      });

      branch.dataValues.manager = manager;

      await transaction.commit();
      res.sendResponse({ branch }, "Successfully created!", 200);
    } catch (e) {
      await transaction.rollback();
      res.sendError({}, "Something went wrong!", 400);
    }
  },
  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;

      if (data.branch) {
        await Branch.update(data.branch, {
          where: {
            id: req.params.id,
          },
          transaction,
        });
      }

      if (data.address) {
        await Address.update(data.address, {
          where: {
            id: sequelize.literal(
              `(SELECT address_id FROM ${Branch.getTableName()} WHERE id = ${req.params.id})`
            ),
          },
          transaction,
        });
      }

      // lastly get the updated data
      const branch = await Branch.findOne({
        where: {
          id: req.params.id,
        },
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
        transaction,
      });

      await transaction.commit();
      res.sendResponse({ branch }, "Successfully updated!", 200);
    } catch (e) {
      await transaction.rollback();
      res.sendError(e, "Something went wrong!", 400);
    }
  },
  destroy: async (req, res) => {
    try {
      await Branch.destroy({
        where: {
          id: req.params.id,
        },
      });

      res.sendResponse({}, "Successfully deleted", 200);
    } catch (e) {
      res.sendError(e, "Something went wrong", 400);
    }
  },
};
