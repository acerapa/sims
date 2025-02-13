const Address = require("../models/address");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");
const Product = require("../models/product");
const { sequelize } = require("../models");
const PurchaseOrderProducts = require("../models/junction/purchase-order-products");
const { findOrder, updateOrder } = require("../services/PurchaseOrderService");
const { Op } = require("sequelize");
const { ItemType } = require("shared/enums");
const ProductDetails = require("../models/product-details");

module.exports = {
  all: async (req, res) => {
    try {
      const orders = await PurchaseOrder.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Address,
            as: "address",
          },
          {
            model: Supplier,
            as: "supplier",
          },
          {
            model: Product,
            as: "products",
            include: [
              {
                model: Supplier,
                as: "suppliers",
                attributes: ["id"],
              },
            ],
          },
        ],
      });
      res.sendResponse({ orders }, "Successfully fetched!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.messge);
    }
  },

  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;

      const address = await Address.create(data.address, {
        transaction: transaction,
      });

      const orderData = { ...data.order, address_id: address.id };
      const purchaseOrder = await PurchaseOrder.create(orderData, {
        transaction: transaction,
      });

      await Promise.all([
        ...data.products.map((product) => {
          return PurchaseOrderProducts.create(
            {
              ...product,
              purchase_order_id: purchaseOrder.dataValues.id,
            },
            { transaction: transaction }
          );
        }),
      ]);

      await transaction.commit();

      const order = await findOrder(purchaseOrder.dataValues.id);

      res.sendResponse({ order }, "Successfully created!");
    } catch (e) {
      await transaction.rollback();
      res.sendError({ ...e }, "Something wen't wrong! => " + e.messge);
    }
  },

  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;

      await updateOrder(req.params.id, data, transaction);

      await transaction.commit();

      const order = await findOrder(req.params.id);

      res.sendResponse({ order }, "Successfully updated!", 200);
    } catch (e) {
      await transaction.rollback();
      res.sendError({ ...e }, "Something wen't wrong! => " + e.message, 400);
    }
  },

  receiveOrder: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body.validated;
      await updateOrder(req.params.id, data, transaction);

      // reflect products stock basing form the quantity received
      const products = await Product.findAll({
        where: {
          id: {
            [Op.in]: data.products.map((p) => p.product_id),
          },
          type: ItemType.INVENTORY,
        },
        attributes: ["id"],
        include: {
          model: ProductDetails,
          as: "product_details",
          attributes: ["id", "stock"],
        },
      });

      await Promise.all(
        products.map((p) => {
          const productData = data.products.find((dp) => dp.product_id == p.id);
          return p.product_details.update({
            stock: p.product_details.stock + productData.quantity_received,
          });
        })
      );

      await transaction.commit();
      res.sendResponse({}, "Successfully received!");
    } catch (error) {
      await transaction.rollback();
      res.sendError(
        { ...error },
        "Something wen't wrong! => " + error.message,
        400
      );
    }
  },

  byId: async (req, res) => {
    try {
      const order = await findOrder(req.params.id);

      res.sendResponse({ order }, "Successfully fetched!");
    } catch (e) {
      res.sendError({ e }, "Something wen't wrong!", 400);
    }
  },

  destory: async (req, res) => {
    try {
      await PurchaseOrder.destroy({
        where: {
          id: req.body.order_id,
        },
      });

      res.sendResponse({}, "Successfully deleted!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong!", 400);
    }
  },
};
