const { TransferType, StockTransferStatus } = require("shared/enums");
const Branch = require("../models/branch");
const ProductDetails = require("../models/product-details");
const StockTransferProducts = require("../models/junction/stock-transfer-products");
const Product = require("../models/product");
const StockTransfer = require("../models/stock-transfer");
const Supplier = require("../models/supplier");
const User = require("../models/user");
const { Op } = require("sequelize");

const findTransfer = async (id) => {
  return await StockTransfer.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Branch,
        as: "receiver",
      },
      {
        model: Branch,
        as: "receiver",
        include: [
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "position"],
          },
        ],
      },
      {
        model: Branch,
        as: "sender",
        include: [
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "position"],
          },
        ],
      },
      {
        model: User,
        as: "process_by",
        attributes: ["id", "first_name", "last_name", "position"],
      },
      {
        model: Product,
        through: StockTransferProducts,
        as: "products",
        attributes: ["id"],
      },
      {
        model: Supplier,
        as: "supplier",
      },
    ],
  });
};

/**
 * Updates a stock transfer
 *
 * @param {*} id Id off the stock transfer
 * @param {*} data Data to update
 * @param {*} transaction Transaction of the query
 */
const updateTransfer = async (id, data, transaction) => {
  if (data.transfer) {
    await StockTransfer.update(data.transfer, {
      where: { id },
      transaction,
    });
  }

  if (data.products) {
    const products = await StockTransferProducts.findAll({
      where: { stock_transfer_id: id },
      attributes: ["id", "product_id"],
    });

    // get products to be linked
    const productsToLink = data.products.filter(
      (p) =>
        !products
          .map((productInDB) => productInDB.product_id)
          .includes(p.product_id)
    );

    // get products to be updated
    const productsToUpdate = data.products.filter((p) =>
      products
        .map((productInDB) => productInDB.product_id)
        .includes(p.product_id)
    );

    // get products to be unlinked
    const productsToUnlink = products.filter(
      (productInDB) =>
        !data.products.map((p) => p.product_id).includes(productInDB.product_id)
    );

    await Promise.all([
      ...productsToLink.map((p) =>
        StockTransferProducts.create(
          { ...p, stock_transfer_id: id },
          { transaction }
        )
      ),
      ...productsToUpdate.map((p) =>
        StockTransferProducts.update(
          { ...p, stock_transfer_id: id },
          {
            where: {
              stock_transfer_id: id,
              product_id: p.product_id,
            },
            transaction,
          }
        )
      ),
      ...productsToUnlink.map((p) => p.destroy({ transaction })),
    ]);
  }

  await reflectStockTransferToStock(data);
};

/**
 * Reflect transfered product stock wheiter a receive or sent stock.
 *
 * @param {*} data Data of the stock transfer
 */
const reflectStockTransferToStock = async (data) => {
  if (data.transfer.status === StockTransferStatus.COMPLETED) {
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: data.products.map((p) => p.product_id),
        },
      },
      attributes: ["id"],
      include: {
        model: ProductDetails,
        as: "product_details",
        attributes: ["id", "stock"],
      },
    });

    if (data.transfer.type === TransferType.IBRR) {
      await Promise.all(
        products.map((p) => {
          const productData = data.products.find((pd) => pd.product_id == p.id);
          return p.product_details.update({
            stock: p.product_details.stock + productData.quantity,
          });
        })
      );
    } else {
      await Promise.all(
        products.map((p) => {
          const productData = data.products.find((pd) => pd.product_id == p.id);
          return p.product_details.update({
            stock: p.product_details.stock - productData.quantity,
          });
        })
      );
    }
  }
};

module.exports = {
  findTransfer,
  updateTransfer,
};
