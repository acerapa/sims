const { sequelize } = require("../models");
const Address = require("../models/address");
const SalesOrderProduct = require("../models/junction/sales-order-product");
const Product = require("../models/product");
const SalesOrder = require("../models/sales-order");

module.exports = {
  all: async (req, res) => {
    try {
      const orders = await SalesOrder.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Address,
            as: "shipment_address",
          },
          {
            model: Product,
            as: "products",
          },
        ],
      });
      res.sendResponse({ orders }, "Sales orders fetched successfully", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong", 400);
    }
  },

  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      let salesOrder = null;
      if (data.sales_order) {
        salesOrder = await SalesOrder.create(data.sales_order, { transaction });
      }

      if (data.sales_order_products && salesOrder) {
        await Promise.all(
          data.sales_order_products.map((salesProduct) => {
            return SalesOrderProduct.create(
              { ...salesProduct, sales_order_id: salesOrder.id },
              { transaction }
            );
          })
        );
      }

      await transaction.commit();
      res.sendResponse({}, "Sales order created successfully", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong", 400);
    }
  },
};
