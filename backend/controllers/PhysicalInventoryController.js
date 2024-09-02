const PhysicalInventory = require("../models/physical-inventory");

module.exports = {
  all: async (req, res) => {
    try {
      const physical_inventories = await PhysicalInventory.findAll();

      res.sendResponse({ physical_inventories }, "Successfully Fetched!", 200);
    } catch (e) {
      res.sendError(e, "Somenthing went wrong!", 400);
    }
  },

  register: async (req, res) => {
    try {
      const data = req.body.validated;
      const physicalInventory = await PhysicalInventory.create(data);

      res.sendResponse(
        { physical_inventory: physicalInventory },
        "Successfully created!",
        200
      );
    } catch (e) {
      res.sendError(e, "Something wen't wrong", 400);
    }
  },

  getOne: async (req, res) => {
    try {
      const physicalInventory = await PhysicalInventory.findOne({
        where: {
          id: req.params.id,
        },
      });

      res.sendResponse(
        { physical_inventory: physicalInventory },
        "Successfully fetched!",
        200
      );
    } catch (e) {
      res.sendError(e, "Something wen't wrong!", 400);
    }
  },
};
