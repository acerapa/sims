const ProductDetails = require("../models/product-details");

/**
 * Updates the stock quantity for multiple products in a physical inventory process
 * @param {Array} items - List of items with physical inventory quantities
 * @param {Object} transaction - Sequelize transaction for database operation
 * @returns {Promise} A promise that resolves when all product stock updates are complete
 */
const reflectPhysicalProductCount = (items, transaction) => {
  return Promise.all(
    items.map((item) => {
      return ProductDetails.update(
        { stock: item.physical_quantity },
        {
          where: { product_id: item.product_id },
          transaction,
        }
      );
    })
  );
};

module.exports = {
  reflectPhysicalProductCount,
};
