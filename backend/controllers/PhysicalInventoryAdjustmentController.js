const { sequelize } = require("../models");

module.exports = {
  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      res.sendSuccess("Physical inventory adjustment registered successfully");
    } catch (e) {
      res.sendError(e, "Error registering physical inventory adjustment");
    }
  },
};
