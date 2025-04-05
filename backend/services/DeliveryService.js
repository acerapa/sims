const Address = require("../models/address");
const Delivery = require("../models/delivery");

/**
 * Updates an existing delivery record with new data, handling address changes.
 *
 * @param {Delivery} delivery - The existing delivery record to update.
 * @param {Object} data - The new data for updating the delivery.
 * @param {Object} [transaction] - Optional database transaction for the update operation.
 * @returns {Promise<void>} A promise that resolves when the delivery is updated.
 */
const updateDelivery = async (delivery, data, transaction) => {
  let addressToDelete = null;
  if (!data.use_customer_address && delivery.use_customer_address) {
    const address = await Address.create(data.address);
    data.address_id = address.id;
  } else if (data.use_customer_address && !delivery.use_customer_address) {
    addressToDelete = delivery.address_id;
  } else if (!data.use_customer_address && !delivery.use_customer_address) {
    await Address.update(data.address, {
      where: {
        id: delivery.address_id,
      },
      transaction,
    });
    data.address_id = delivery.address_id;
  }

  await delivery.update(data, { transaction });

  // Delete the address if it's no longer needed
  if (addressToDelete) {
    await Address.destroy({
      where: {
        id: addressToDelete,
      },
      transaction,
    });
  }
};

/**
 * Creates a new delivery record with optional address inclusion.
 *
 * @param {Object} data - The delivery data to be created.
 * @param {Object} [transaction] - Optional database transaction for the create operation.
 * @returns {Promise<Delivery>} A promise that resolves to the created delivery.
 */
const createDelivery = async (data, transaction) => {
  const includeAddress = [];
  if (!data.address_id) {
    includeAddress.push({
      model: Address,
      as: "address",
    });
  }

  await Delivery.create(data, {
    include: includeAddress,
    transaction,
  });
};

/**
 * Finds a delivery by its primary key (ID).
 *
 * @param {number|string} id - The unique identifier of the delivery.
 * @returns {Promise<Delivery|null>} A promise that resolves to the delivery with associated address, or null if not found.
 */
const findDelivery = async (id) => {
  return await Delivery.findByPk(id, {
    include: [
      {
        model: Address,
        as: "address",
      },
    ],
  });
};

/**
 * Finds a delivery by its associated sales order ID.
 *
 * @param {number|string} salesOrderId - The unique identifier of the sales order.
 * @returns {Promise<Delivery|null>} A promise that resolves to the delivery with associated address, or null if not found.
 */
const findDeliveryBySalesOrderId = async (salesOrderId) => {
  return await Delivery.findOne({
    where: {
      sales_order_id: salesOrderId,
    },
    include: [
      {
        model: Address,
        as: "address",
      },
    ],
  });
};

module.exports = {
  findDelivery,
  updateDelivery,
  createDelivery,
  findDeliveryBySalesOrderId,
};
