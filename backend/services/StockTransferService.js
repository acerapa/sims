const { TransferType } = require("shared/enums");
const Branch = require("../models/branch");
const StockTransferProducts = require("../models/junction/stock-transfer-products");
const Product = require("../models/product");
const StockTransfer = require("../models/stock-transfer");
const Supplier = require("../models/supplier");
const User = require("../models/user");

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

const reflectStockTransferToStock = async (data) => {
  if (data.transfer.status) {
    if (data.transfer.type === TransferType.IBRR) {
      // increase the stock of the receive products
    } else {
      // decrease the stock of the send products
    }
  }
};

module.exports = {
  findTransfer,
  updateTransfer,
};
