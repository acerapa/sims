const Address = require("../models/address");
const SalesOrderProduct = require("../models/junction/sales-order-product");
const Product = require("../models/product");
const SalesOrder = require("../models/sales-order");
const { sequelize } = require("../models");

const findSalesOrder = async (id) => {
  return await SalesOrder.findByPk(id, {
    include: [
      {
        model: Product,
        as: "products",
      },
    ],
  });
};

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
};
