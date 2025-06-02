const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../");
const PhysicalInventoryItem = require("../physical-inventory-item");
const PhysicalInventoryAdjustments = require("../physical-inventory-adjustments");

class ItemToAdjustments extends Model {}

ItemToAdjustments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PhysicalInventoryItem,
        key: "id",
      },
    },
    adjustment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PhysicalInventoryAdjustments,
        key: "id",
      },
    },
    current_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    new_quantity: {
      type: DataTypes.INTEGER,
      allowNull: 0,
      defaultValue: 0,
    },
    difference: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize }
);

module.exports = ItemToAdjustments;
