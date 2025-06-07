const { sequelize } = require("../models");
const PhysicalInventoryAdjusments = require("../models/physical-inventory-adjustments")
const ItemToAdjustments = require("../models/junction/item-to-adjustments");
const PhysicalInventoryItem = require('../models/physical-inventory-item')
const User = require("../models/user");
const ProductDetail = require("../models/product-details")
const Product = require("../models/product");
const ProductCategory = require("../models/product-category");
const { reflectPhysicalProductCountFromAdjustments } = require("../services/PhysicalInventoryService");

module.exports = {
  all: async (req, res) => {
    try {
      const adjustments = await PhysicalInventoryAdjusments.findAll({
        include: [
          {
            model: User,
            as: 'adjusted_by',
            attributes: ['first_name', 'middle_name', 'last_name']
          }
        ],
        order: [["createdAt", "DESC"]],
      })

      res.sendResponse({adjustments}, "Successfully fetched adjustments!")
    } catch (e) {
      res.sendError({e}, "Something went wrong!")
    }
  },
  
  register: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const data = req.body.validated
      let adjustment = null

      if (data.adjustment_information) {
        adjustment = await PhysicalInventoryAdjusments.create(data.adjustment_information, { transaction })
        
        if (adjustment) {
          await Promise.all(
            data.items.map(item => {
              return ItemToAdjustments.create(
                {
                  ...item,
                  adjustment_id: adjustment.id
                },
                { transaction }
              )
            })
          )

          // update product stock
          await reflectPhysicalProductCountFromAdjustments(data.items, transaction)
        }
      }
      

      await transaction.commit()
      res.sendResponse({adjustment}, "Physical inventory adjustment registered successfully");
    } catch (e) {
      await transaction.rollback()
      res.sendError(e, "Error registering physical inventory adjustment");
    }
  },

  getOne: async (req, res) => {
    try {
      const adjustment = await PhysicalInventoryAdjusments.findByPk(req.params.id, {
        include: [
          {
            model: PhysicalInventoryItem,
            as: "adjustment_items",
            attributes: ["id", "product_id"],
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id"],
                include: [
                  {
                    model: ProductDetail,
                    as: 'product_details',
                    attributes: ["id", "purchase_description"]
                  },
                  {
                    model: ProductCategory,
                    as: "categories",
                    attributes: ["name"]
                  }
                ]
              }
            ] 
          }
        ]
      })

      res.sendResponse({adjustment}, "Successfully fetched!")
    } catch (e) {
      res.sendError({e}, 'Something went wrong!')
    }
  }
};
