const { sequelize } = require("../models");
const PhysicalInventoryAdjusments = require("../models/physical-inventory-adjustments")
const ItemToAdjustments = require("../models/junction/item-to-adjustments")

module.exports = {
  register: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const data = req.body.validated
      let adjustment = null

      if (data.adjustment_information) {
        adjustment = await PhysicalInventoryAdjusments.create(data.adjustment_information, { transaction })
        
        if (adjustment) {
          await Promise.all(
            data.items.map(item => ItemToAdjustments.create(
                {
                  ...item,
                  adjustment_id: adjustment.id
                },
                { transaction }
              )
            )
          )
        
        } 
      }
      

      await transaction.commit()
      res.sendResponse({adjustment}, "Physical inventory adjustment registered successfully");
    } catch (e) {
      console.log(e)
      await transaction.rollback()
      res.sendError(e, "Error registering physical inventory adjustment");
    }
  },
};
