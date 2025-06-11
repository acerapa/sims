const { Model, DataTypes } = require("sequelize");
const Product = require("../product");
const Invoice = require("../invoice");
const { sequelize } = require("../");

class InvoiceProducts extends Model {}

InvoiceProducts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Invoice,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    serial_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    timestamps: false,
  },
);

module.exports = InvoiceProducts;
