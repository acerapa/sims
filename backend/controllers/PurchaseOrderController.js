const Address = require("../models/address");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");
const Product = require("../models/product");
const ProductTransaction = require("../models/product-transaction");
const { sequelize } = require("../models");

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
          return ProductTransaction.create(
            {
              ...product,
              transfer_id: purchaseOrder.dataValues.id,
            },
            { transaction: transaction }
          );
        }),
      ]);

      await transaction.commit();

      const order = await PurchaseOrder.findOne({
        where: {
          id: purchaseOrder.dataValues.id,
        },
        include: [
          {
            model: Address,
            as: "address",
          },
          {
            model: Supplier,
            as: "supplier",
          },
        ],
      });

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
      if (data.order) {
        const purchaseOrder = await PurchaseOrder.findOne({
          where: {
            id: req.params.id,
          },
        });

        await purchaseOrder.update(data.order, {
          transaction: transaction,
        });

        // update related products
        if (data.products) {
          const products = await ProductTransaction.findAll({
            where: { transfer_id: req.params.id },
            attributes: ["id", "product_id"],
          });

          const currentProductIds = products.map((p) => p.product_id);

          await Promise.all([
            // determine the products in data.products needs to be created
            ...data.products
              .filter((p) => !currentProductIds.includes(p.product_id))
              .map((p) =>
                ProductTransaction.create(
                  { ...p, transfer_id: req.params.id },
                  { transaction: transaction }
                )
              ),

            // determine the products weither they it will be updated or deleted
            ...products.map((product) => {
              // TODO: Need to check if the data has changes to update
              const dataProductIds = data.products.map((p) => p.product_id);

              if (dataProductIds.includes(product.product_id)) {
                const toUpdateFields = data.products.find(
                  (p) => p.product_id == product.product_id
                );

                return ProductTransaction.update(toUpdateFields, {
                  where: {
                    id: product.id,
                  },
                  transaction: transaction,
                });
              } else {
                return ProductTransaction.destroy({
                  where: {
                    id: product.id,
                  },
                  transaction: transaction,
                });
              }
            }),
          ]);
        }

        // update purchase order address
        if (data.address) {
          await Address.update(data.address, {
            where: {
              id: purchaseOrder.address_id,
            },
            transaction: transaction,
          });
        }
      }
      await transaction.commit();
      res.sendResponse({}, "Successfully updated!", 200);
    } catch (e) {
      await transaction.rollback();
      res.sendError({ ...e }, "Something wen't wrong! => " + e.message, 400);
    }
  },

  byId: async (req, res) => {
    try {
      const order = await PurchaseOrder.findByPk(req.params.id, {
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

      // map products to get the cost from the supplier
      order.products = order.products.map((product) => {
        let supplier = product.suppliers.find(
          (sup) => sup.id == order.supplier_id
        );
        product.cost = supplier ? supplier.ProductSupplier.cost : product.cost;
        return product;
      });

      res.sendResponse({ order }, "Successfully fetched!");
    } catch (e) {
      res.sendError({ e }, "Something wen't wrong!", 400);
    }
  },

  delete: async (req, res) => {
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
