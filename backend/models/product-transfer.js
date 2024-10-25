const { Model, DataTypes } = require("sequelize");
const Product = require("../models/product");
const B2BTransfer = require("./b2b-transfer");
const { sequelize } = require(".");
class ProductTransfer extends Model {}

ProductTransfer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
    transfer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: B2BTransfer,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = ProductTransfer;
