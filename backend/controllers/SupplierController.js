const Address = require("../models/address");
const Supplier = require("../models/supplier");
const { sequelize } = require("../models/index");

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
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;

      const address = await Address.create(data.address, { transaction });

      await Supplier.create(
        {
          ...data.vendor,
          address_id: address.id,
        },
        { transaction }
      );

      await transaction.commit();

      res.sendResponse({}, "Successfully registered!", 200);
    } catch (e) {
      await transaction.rollback();
      res.sendError(e, "Somenthing wen't wrong => " + e.message, 400);
    }
  },

  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      const supplier = await Supplier.findByPk(req.params.id, {
        include: {
          model: Address,
          as: "address",
        },
      });

      if (!supplier) {
        throw new Error("Supplier not found!");
      }

      await supplier.update(data.vendor, { transaction });
      await supplier.address.update(data.address, { transaction });

      await transaction.commit();

      res.sendResponse({}, "Successfully updated!");
    } catch (e) {
      await transaction.rollback();
      res.sendError(e.details, "Something wen't wrong! => " + e.message, 400);
    }
  },

  getById: async (req, res) => {
    try {
      const supplier = await Supplier.findByPk(req.params.id, {
        include: {
          model: Address,
          as: "address",
        },
      });
      res.sendResponse({ supplier }, "Successfully fetched!", 200);
    } catch (error) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
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
