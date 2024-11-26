const Address = require("../models/address");
const Supplier = require("../models/supplier");
const sequelize = require("sequelize");

module.exports = {
  all: async (req, res) => {
    try {
      const suppliers = await Supplier.findAll({
        order: [["createdAt", "DESC"]],
        include: {
          model: Address,
          as: "address",
        },
      });
      res.sendResponse({ suppliers }, "Successfully fetched", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },

  register: async (req, res) => {
    try {
      const transaction = await sequelize.transaction();
      const data = req.validated;

      const address = await Address.create(data.address, { transaction });
      await Supplier.create(
        {
          ...data.vendor,
          address_id: address.id,
        },
        { transaction }
      );

      res.sendResponse({}, "Successfully registered!", 200);
    } catch (e) {
      res.sendError(e, "Somenthing wen't wrong => " + e.message, 400);
    }
  },

  update: async (req, res) => {
    try {
      await Supplier.update(req.body, { where: { id: req.body.id } });
      if (Object.keys(req.body).includes("address")) {
        await Address.update(req.body.address, {
          where: { id: req.body.address.id },
        });
      }
      res.sendResponse({}, "Successfully updated!");
    } catch (e) {
      res.sendError(e.details, "Something wen't wrong! => " + e.message, 400);
    }
  },

  delete: async (req, res) => {
    try {
      await Supplier.destroy({ where: { id: req.params.id } });
      res.sendResponse({}, "Successfully deleted!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },
};
