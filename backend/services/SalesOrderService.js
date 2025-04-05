const Address = require("../models/address");
const SalesOrderProduct = require("../models/junction/sales-order-product");
const Product = require("../models/product");
const SalesOrder = require("../models/sales-order");
const { sequelize } = require("../models");
const User = require("../models/user");
const Delivery = require("../models/delivery");
const PaymentMethod = require("../models/payment-method");
const Customer = require("../models/customer");

/**
 * Retrieves a sales order by its ID with selected related model attributes
 * @param {number} id - The unique identifier of the sales order
 * @returns {Promise<SalesOrder>} A sales order with associated products, sales person, and delivery details
 */
const findSalesOrder = async (id) => {
  return await SalesOrder.findByPk(id, {
    include: [
      {
        model: Product,
        as: "products",
        attributes: ["id"],
      },
      {
        model: User,
        as: "sales_person",
      },
      {
        model: Delivery,
        as: "delivery",
        include: [
          {
            model: Address,
            as: "address",
          },
        ],
      },
    ],
  });
};

/**
 * Retrieves a minimal sales order by its ID with selected related model attributes
 * @param {number} id - The unique identifier of the sales order
 * @returns {Promise<SalesOrder>} A sales order with minimal associated data
 */
const findSalesOrderMinimal = async (id) => {
  return await SalesOrder.findByPk(id, {
    include: [
      {
        model: Product,
        as: "products",
        attributes: ["id"],
      },
      {
        model: PaymentMethod,
        as: "payment_method",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "sales_person",
        attributes: ["id", "first_name", "last_name"],
      },
      {
        model: Delivery,
        as: "delivery",
        attributes: ["id"],
      },
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "first_name", "last_name"],
      },
    ],
  });
};

/**
 * Updates a sales order and its associated data
 * @param {number} id - The unique identifier of the sales order to update
 * @param {Object} data - The data to update, which can include shipment address, sales order details, and sales order products
 * @param {Object} transaction - The database transaction to use for the update operation
 * @returns {Promise<void>} A promise that resolves when the update is complete
 */
const updateSalesOrder = async (id, data, transaction) => {
  if (data.shipment_address) {
    await Address.update(data.shipment_address, {
      where: {
        id: sequelize.literal(
          `(SELECT shipment_address_id FROM ${SalesOrder.tableName} WHERE id = ${id})`
        ),
      },
      transaction,
    });
  }

  if (data.sales_order) {
    await SalesOrder.update(data.sales_order, {
      where: { id },
      transaction,
    });
  }

  if (data.sales_order_products) {
    const products = await SalesOrderProduct.findAll({
      where: { sales_order_id: id },
      attributes: ["id", "product_id"],
    });

    // map product_id from current products
    const currentProductIds = products.map((p) => p.product_id);

    // get products to be linked
    const productsToLink = data.sales_order_products.filter(
      (sop) => !currentProductIds.includes(sop.product_id)
    );

    // get products need to be updated
    const productsToUpdate = products.filter((p) =>
      data.sales_order_products
        .map((sop) => sop.product_id)
        .includes(p.product_id)
    );

    // get products need to be unlinked/deleted
    const productsToUnlink = products.filter(
      (p) =>
        !data.sales_order_products
          .map((sop) => sop.product_id)
          .includes(p.product_id)
    );

    // Execute the transactions
    await Promise.all([
      ...productsToLink.map((p) => {
        return SalesOrderProduct.create(
          { ...p, sales_order_id: id },
          { transaction }
        );
      }),
      ...productsToUpdate.map((p) => {
        const dataToUpdate = data.sales_order_products.find(
          (sop) => sop.product_id == p.product_id
        );
        return p.update(dataToUpdate, { transaction });
      }),
      ...productsToUnlink.map((p) => p.destroy({ transaction })),
    ]);
  }
};

module.exports = {
  findSalesOrder,
  updateSalesOrder,
  findSalesOrderMinimal,
};
