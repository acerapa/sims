const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Supplier = require("./supplier");
const PurchaseOrder = require("./purchase-order");

class Address extends Model {}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Supplier,
        key: "id",
      },
      allowNull: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: PurchaseOrder,
        key: "id"
      }
    }
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Address;
