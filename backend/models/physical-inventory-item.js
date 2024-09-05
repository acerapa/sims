const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const {} = require("./physical-inventory");
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    physical_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
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
