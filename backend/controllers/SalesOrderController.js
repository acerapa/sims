const { sequelize } = require("../models");
const Address = require("../models/address");
const SalesOrderProduct = require("../models/junction/sales-order-product");
const PaymentMethod = require("../models/payment-method");
const Product = require("../models/product");
const SalesOrder = require("../models/sales-order");
const {
  findSalesOrder,
  updateSalesOrder,
} = require("../services/SalesOrderService");

module.exports = {
  all: async (req, res) => {
    try {
      const orders = await SalesOrder.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Product,
            as: "products",
          },
          {
            model: PaymentMethod,
            as: "payment_method",
          },
        ],
      });
      res.sendResponse({ orders }, "Sales orders fetched successfully", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong", 400);
    }
  },

  byId: async (req, res) => {
    try {
      const order = await findSalesOrder(req.params.id);

      res.sendResponse({ order }, "Sales order fetched successfully", 200);
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
        salesOrder = await SalesOrder.create(
          { ...data.sales_order },
          { transaction }
        );
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

      const order = await findSalesOrder(salesOrder.id);
      res.sendResponse({ order }, "Sales order created successfully", 200);
    } catch (error) {
      await transaction.rollback();
      res.sendError(error, "Something went wrong", 400);
    }
  },

  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      await updateSalesOrder(req.params.id, data, transaction);
      await transaction.commit();

      const order = await findSalesOrder(req.params.id);
      res.sendResponse({ order }, "Sales order updated successfully", 200);
    } catch (error) {
      await transaction.rollback();
      res.sendError(error, "Something went wrong", 400);
    }
  },

  destroy: async (req, res) => {
    try {
      await SalesOrder.destroy({
        where: {
          id: req.params.id,
        },
      });

      res.sendResponse({}, "Sales order deleted successfully", 200);
    } catch (error) {
      res.sendError(error, "Something went wrong", 400);
    }
  },
};
