const { sequelize } = require("../models");
const PhysicalInventory = require("../models/physical-inventory");
const PhysicalInventoryItem = require("../models/physical-inventory-item");
const Product = require("../models/product");

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
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      let physicalInventory = null;
      if (data.physical_inventory) {
        physicalInventory = await PhysicalInventory.create(
          data.physical_inventory,
          {
            transaction: transaction,
          }
        );
      }

      if (physicalInventory && data.items) {
        await Promise.all(
          data.items.map((item) => {
            item.physical_inventory_id = physicalInventory.id;
            return PhysicalInventoryItem.create(item, {
              transaction: transaction,
            });
          })
        );
      }

      await transaction.commit();

      res.sendResponse(
        { physical_inventory: physicalInventory },
        "Successfully created!",
        200
      );
    } catch (e) {
      await transaction.rollback();
      res.sendError(e, "Something wen't wrong", 400);
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
            transaction: transaction,
          });
        }

        if (data.items) {
          await Promise.all([
            data.items.map((item) => {
              const item_copy = { ...item };
              delete item_copy;
              return PhysicalInventoryItem.update(item_copy, {
                where: {
                  id: item.id,
                },
                transaction: transaction,
              });
            }),
          ]);
        }
      } else {
        throw "Not found!";
      }

      await transaction.commit();
      res.sendResponse({}, "Successfully Updated", 200);
    } catch (e) {
      await transaction.rollback();
      res.sendError(e, "Something went wrong!", 400);
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
          id: req.body.id,
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
