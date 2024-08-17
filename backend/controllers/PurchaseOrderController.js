const Address = require("../models/address");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");
const Product = require("../models/product");
const ProductOrder = require("../models/product-order");
const { ProductOrderedStatus } = require("shared/enums/purchase-order");

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
    try {
      const data = req.body.validated;
      const purchaseOrder = await PurchaseOrder.create(data.order);

      const address = { ...data.address, order_id: purchaseOrder.id };
      await Address.create(address);

      data.products.forEach(async (product) => {
        await purchaseOrder.addProduct(product.product_id, {
          through: {
            cost: product.cost,
            amount: product.amount,
            quantity: product.quantity,
            description: product.description,
            status: product.status ? product.status : ProductOrderedStatus.OPEN,
            quantity_received: product.quantity_received
              ? product.quantity_received
              : 0,
          },
        });
      });
      res.sendResponse({}, "Successfully created!");
    } catch (e) {
      res.sendError({ ...e }, "Something wen't wrong! => " + e.messge);
    }
  },

  update: async (req, res) => {
    try {
      const data = req.body.validated;
      if (data.order) {
        await PurchaseOrder.update(data.order, {
          where: {
            id: req.params.id,
          },
        });

        // update related products
        if (data.products) {
          const products = await ProductOrder.findAll({
            where: { order_id: req.params.id },
            attributes: ["id", "product_id"],
          });

          const currentProductIds = products.map((p) => p.product_id);
          console.log(currentProductIds, data.products);

          await Promise.all([
            // determine the products in data.products needs to be created
            ...data.products
              .filter((p) => !currentProductIds.includes(p.product_id))
              .map((p) =>
                ProductOrder.create({ ...p, order_id: req.params.id })
              ),

            // determine the products weither they it will be updated or deleted
            ...products.map((product) => {
              // TODO: Need to check if the data has changes to update
              const dataProductIds = data.products.map((p) => p.product_id);

              if (dataProductIds.includes(product.product_id)) {
                const toUpdateFields = data.products.find(
                  (p) => p.product_id == product.product_id
                );

                return ProductOrder.update(toUpdateFields, {
                  where: {
                    id: product.id,
                  },
                });
              } else {
                return ProductOrder.destroy({
                  where: {
                    id: product.id,
                  },
                });
              }
            }),
          ]);
        }

        // update purchase order address
        if (data.address) {
          await Address.update(data.address, {
            where: {
              order_id: req.params.id,
            },
          });
        }
      }

      res.sendResponse({}, "Successfully updated!", 200);
    } catch (e) {
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
