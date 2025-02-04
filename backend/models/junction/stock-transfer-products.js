const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../");
const Product = require("../product");
const StockTranfer = require("../stock-transfer");

class StockTransferProducts extends Model {}

StockTransferProducts.init(
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
    stock_transfer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: StockTranfer,
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { sequelize }
);

module.exports = StockTransferProducts;
