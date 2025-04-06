const Address = require("../models/address");
const Delivery = require("../models/delivery");

module.exports = {
  all: async (req, res) => {
    try {
      const deliveries = await Delivery.findAll({
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
};
