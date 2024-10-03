const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const PhysicalInventory = require("./physical-inventory");
const Product = require("./product");

class PhysicalInventoryItem extends Model {}

PhysicalInventoryItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    physical_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    physical_inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PhysicalInventory,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = PhysicalInventoryItem;
