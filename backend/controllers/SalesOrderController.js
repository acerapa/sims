const { sequelize } = require("../models");
const SalesOrderProduct = require("../models/junction/sales-order-product");
const SalesOrder = require("../models/sales-order");

module.exports = {
  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      let salesOrder = null;
      if (data.sales_order) {
        salesOrder = await SalesOrder.create(data, { transaction });
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

  all: async (req, res) => {
    try {
      const salesOrders = await SalesOrder.findAll();
      res.sendResponse(salesOrders, "Sales orders fetched successfully", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong", 400);
    }
  },
};
