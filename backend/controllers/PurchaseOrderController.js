const Address = require("../models/address");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");
const Product = require("../models/product");
const ProductOrder = require("../models/product-order");

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
            quantity: product.quantity,
            amount: product.amount,
          },
        });
      });
      res.sendResponse({}, "Successfully created!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.messge);
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
      }

      if (data.products) {
        await ProductOrder.destroy({
          where: {
            product_id: req.params.id,
          },
        });

        for (let product in data.products) {
          console.log(product);
        }
      }

      res.sendResponse({}, "Successfully updated!", 200);
    } catch (e) {
      res.sendError({}, "Something wen't wrong!", 400);
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
