const { Model, DataTypes } = require("sequelize");
const Product = require("../product");
const { ProductOrderedStatus } = require("shared/enums");
const PurchaseOrder = require("../purchase-order");
const { sequelize } = require("../");

class PurchaseOrderProducts extends Model {}

PurchaseOrderProducts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    purchase_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PurchaseOrder,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity_received: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(ProductOrderedStatus),
      defaultValue: ProductOrderedStatus.OPEN,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = PurchaseOrderProducts;
