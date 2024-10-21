const B2BTransfer = require("../models/b2b-transfer");

module.exports = {
  registerIBRR: async (req, res) => {
    try {
      const data = req.body.validated;
      const transfer = await B2BTransfer.create();
    } catch (e) {}
  },
};
