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
      await PhysicalInventory.create(data);

      res.sendResponse({}, "Successfully created!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong", 400);
    }
  },
};
