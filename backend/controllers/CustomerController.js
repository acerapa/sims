const { sequelize } = require("../models");
const Address = require("../models/address");
const Customer = require("../models/customer");

module.exports = {
  all: async (req, res) => {
    try {
      const customers = await Customer.findAll({
        order: [["createdAt", "DESC"]],
        include: {
          model: Address,
          as: "address",
        },
      });

      res.sendResponse({ customers }, "Successfull fetched!", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong!", 400);
    }
  },

  byId: async (req, res) => {
    try {
      const customer = await Customer.findOne({
        where: {
          id: req.params.id,
        },
        include: {
          model: Address,
          as: "address",
        },
      });

      res.sendResponse({ customer }, "Successfully fetched!", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong!", 400);
    }
  },

  register: async (req, res) => {
    try {
      const data = req.body.validated;

      const customer = await Customer.create(data, {
        include: { model: Address, as: "address" },
      });

      res.sendResponse({ customer }, "Successfully created!", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong!", 400);
    }
  },

  update: async (req, res) => {
    try {
      const data = req.body.validated;
      await Customer.update(data, {
        where: {
          id: req.params.id,
        },
      });

      if (data.address) {
        await Address.update(data.address, {
          where: {
            id: sequelize.literal(
              `(SELECT address_id FROM ${Customer.getTableName()} WHERE id = ${req.params.id})`
            ),
          },
        });
      }

      const customer = await Customer.findOne({
        where: {
          id: req.params.id,
        },
        include: {
          model: Address,
          as: "address",
        },
      });

      res.sendError({ customer }, "Successfully updated!", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong!", 400);
    }
  },

  destroy: async (req, res) => {
    try {
      await Customer.destroy({
        where: {
          id: req.params.id,
        },
      });

      res.sendResponse({}, "Successfully deleted!", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong!", 400);
    }
  },
};
