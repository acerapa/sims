const Address = require("../models/address");
const PurchaseOrderProducts = require("../models/junction/purchase-order-products");
const Product = require("../models/product");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");
const { sequelize } = require("../models");
const ProductDetails = require("../models/product-details");

/**
 * This function will return a purchase order promise containing the purchase order and its related products by purchase order id
 *
 * @param {*} id Purchase order id
 * @returns Promise<PurchaseOrder>
 */
const findOrder = async (id) => {
  return await PurchaseOrder.findByPk(id, {
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
          {
            model: ProductDetails,
            as: "product_details",
          },
        ],
      },
    ],
  });
};

/**
 * This method will update the purchase order and its related products
 *
 * @param {*} id Purchase order id
 * @param {*} data Data to update
 * @param {*} transaction Transaction from sequelize, we strickly use transaction to prevent data inconsistency
 */
const updateOrder = async (id, data, transaction) => {
  if (data.order) {
    await PurchaseOrder.update(data.order, {
      where: { id },
      transaction,
    });

    if (data.products) {
      const products = await PurchaseOrderProducts.findAll({
        where: { purchase_order_id: id },
        attributes: ["id", "product_id"],
      });

      // current products in the database
      const currentProductIds = products.map((p) => p.product_id);

      // get products need to be linked
      const productsToLink = data.products.filter(
        (p) => !currentProductIds.includes(p.product_id)
      );

      // get products need to be updated
      const productsToUpdate = data.products.filter((p) =>
        currentProductIds.includes(p.product_id)
      );

      // get products need to be unlinked/deleted
      const productsToUnlink = products.filter(
        (p) => !data.products.map((dp) => dp.product_id).includes(p.product_id)
      );

      // Execute the transaction
      await Promise.all([
        ...productsToLink.map((p) =>
          PurchaseOrderProducts.create(
            { ...p, purchase_order_id: id },
            { transaction }
          )
        ),
        ...productsToUpdate.map((p) =>
          PurchaseOrderProducts.update(
            { ...p },
            {
              where: {
                purchase_order_id: id,
                product_id: p.product_id,
              },
              transaction,
            }
          )
        ),
        ...productsToUnlink.map((p) => p.destroy({ transaction })),
      ]);
    }

    if (data.address) {
      await Address.update(data.address, {
        where: {
          id: sequelize.literal(
            `(SELECT address_id FROM ${PurchaseOrder.getTableName()} WHERE id = ${id})`
          ),
        },
        transaction,
      });
    }
  }
};

/**
 * Receives a purchase order by updating its status, product details, and preparing for stock update
 * @param {number} id - The unique identifier of the purchase order
 * @param {Object} data - The data containing order and product update information
 * @param {Object} transaction - The database transaction for ensuring data consistency
 */
const orderReceive = async (id, data, transaction) => {
  if (data.order) {
    await PurchaseOrder.update(data.order, {
      where: { id },
      transaction,
    });

    if (data.products) {
      await Promise.all(
        data.products.map((p) =>
          PurchaseOrderProducts.update(
            {
              quantity_received: p.quantity_received,
              remarks: p.remarks,
              status: p.status,
            },
            {
              where: { id: p.id },
              transaction,
            }
          )
        )
      );
    }

    // TODO: Update products stock
  }
};

module.exports = {
  findOrder,
  orderReceive,
};
