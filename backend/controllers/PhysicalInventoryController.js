const { PhysicalInventoryStatus } = require("shared/enums");
const { sequelize } = require("../models");
const PhysicalInventory = require("../models/physical-inventory");
const PhysicalInventoryItem = require("../models/physical-inventory-item");
const Product = require("../models/product");
const ProductDetails = require("../models/product-details");
const {
  reflectPhysicalProductCount,
} = require("../services/PhysicalInventoryService");

module.exports = {
  all: async (req, res) => {
    try {
      const physical_inventories = await PhysicalInventory.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.sendResponse({ physical_inventories }, "Successfully Fetched!", 200);
    } catch (e) {
      res.sendError(e, "Somenthing went wrong!", 400);
    }
  },

  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      const createdPhysicalInventory = await PhysicalInventory.create(
        data.physical_inventory,
        { transaction }
      );

      const items = data.items.map((item) => {
        return {
          ...item,
          physical_inventory_id: createdPhysicalInventory.id,
        };
      });

      await PhysicalInventoryItem.bulkCreate(items, { transaction });

      if (data.physical_inventory.status === PhysicalInventoryStatus.DONE) {
        await reflectPhysicalProductCount(data.items, transaction);
      }

      await transaction.commit();

      res.sendResponse(
        { physical_inventory: createdPhysicalInventory },
        "Successfully registered!"
      );
    } catch (error) {
      await transaction.rollback();
      res.sendError(e, "Something went wrong! => " + e.message, 400);
    }
  },

  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      const physicalInventory = await PhysicalInventory.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (physicalInventory) {
        if (data.physical_inventory) {
          await physicalInventory.update(data.physical_inventory, {
            transaction,
          });
        }

        if (data.items) {
          await Promise.all(
            data.items.map((item) =>
              PhysicalInventoryItem.update(item, {
                where: {
                  product_id: item.product_id,
                  physical_inventory_id: physicalInventory.id,
                },
              })
            )
          );

          if (data.physical_inventory.status === PhysicalInventoryStatus.DONE) {
            await reflectPhysicalProductCount(data.items, transaction);
          }
        }
      } else {
        throw new Error("Physical Inventory not found!");
      }

      await transaction.commit();
      res.sendResponse({}, "Successfully Updated", 200);
    } catch (e) {
      await transaction.rollback();
      res.sendError(e, "Something went wrong! =>" + e.message, 400);
    }
  },

  getOne: async (req, res) => {
    try {
      const physicalInventory = await PhysicalInventory.findOne({
        where: {
          id: req.params.id,
        },
        include: {
          model: PhysicalInventoryItem,
          as: "items",
          include: {
            model: Product,
            as: "product",
          },
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

  destroy: async (req, res) => {
    try {
      await PhysicalInventory.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.sendResponse({}, "Successfully deleted!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },

  updateItem: async (req, res) => {
    try {
      // TODO: Need to create a script to update the PhysicalInventoryItem by id
      const data = req.body.validated;
      await PhysicalInventoryItem.update(data, {
        where: {
          id: req.params.id,
        },
      });

      res.sendResponse({}, "Successfully updated!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },
};
