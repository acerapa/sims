const Address = require("../models/address");
const Delivery = require("../models/delivery");
const { findDelivery } = require("../services/DeliveryService");

module.exports = {
  all: async (req, res) => {
    try {
      const deliveries = await Delivery.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Address,
            as: "address",
          },
        ],
      });

      res.sendResponse({ deliveries }, "Successfully fetched deliveries");
    } catch (error) {
      res.sendError({ error }, "Failed to fetch deliveries");
    }
  },
  byId: async (req, res) => {
    try {
      const delivery = await Delivery.findByPk(req.params.id, {
        include: [
          {
            model: Address,
            as: "address",
          },
        ],
      });

      res.sendResponse({ delivery }, "Successfully fetched delivery");
    } catch (error) {
      res.sendError({ error }, "Failed to fetch delivery");
    }
  },
  updateStatus: async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body.validated;

      await Delivery.update(
        { status },
        {
          where: { id },
        }
      );

      const delivery = await findDelivery(id);
      res.sendResponse({ delivery }, "Successfully updated delivery status");
    } catch (error) {
      res.sendError({ error }, "Failed to update delivery status");
    }
  },
};
