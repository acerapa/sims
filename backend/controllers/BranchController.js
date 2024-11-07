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
  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      const address = await Address.create(data.address, { transaction });
      const branch = { ...data.branch, address_id: address.id };
      await Branch.create(branch, { transaction });

      await transaction.commit();
      res.sendResponse({}, "Successfully created!", 200);
    } catch (e) {
      await transaction.rollback();
      res.sendError({}, "Something went wrong!", 400);
    }
  },
  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      const branch = await Branch.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (data.address) {
        await Address.update(data.address, {
          where: {
            id: branch.address_id,
          },
          transaction,
        });
      }

      if (data.branch) {
        await branch.update(data.branch, { transaction });
      }

      await transaction.commit();
      res.sendResponse({}, "Successfully updated!", 200);
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
